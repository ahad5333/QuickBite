import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc, query } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from './AuthContext';

interface CartItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (menuItemId: string) => Promise<void>;
  updateQuantity: (menuItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  total: 0
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    const cartRef = collection(db, 'users', user.uid, 'cart');
    const q = query(cartRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cartItems = snapshot.docs.map(doc => doc.data() as CartItem);
      setItems(cartItems);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/cart`);
    });

    return unsubscribe;
  }, [user]);

  const addToCart = async (item: CartItem) => {
    if (!user) return;
    const itemRef = doc(db, 'users', user.uid, 'cart', item.menuItemId);
    try {
      const existingItem = items.find(i => i.menuItemId === item.menuItemId);
      if (existingItem) {
        await updateDoc(itemRef, { quantity: existingItem.quantity + item.quantity });
      } else {
        await setDoc(itemRef, item);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/cart/${item.menuItemId}`);
    }
  };

  const removeFromCart = async (menuItemId: string) => {
    if (!user) return;
    const itemRef = doc(db, 'users', user.uid, 'cart', menuItemId);
    try {
      await deleteDoc(itemRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/cart/${menuItemId}`);
    }
  };

  const updateQuantity = async (menuItemId: string, quantity: number) => {
    if (!user) return;
    if (quantity <= 0) {
      await removeFromCart(menuItemId);
      return;
    }
    const itemRef = doc(db, 'users', user.uid, 'cart', menuItemId);
    try {
      await updateDoc(itemRef, { quantity });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}/cart/${menuItemId}`);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    // Firestore doesn't have a "delete collection" in client SDK, so we delete each doc
    try {
      const deletePromises = items.map(item => deleteDoc(doc(db, 'users', user.uid, 'cart', item.menuItemId)));
      await Promise.all(deletePromises);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/cart`);
    }
  };

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
