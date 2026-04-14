import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { toast } from 'sonner';
import { Input } from './ui/input';
import { Label } from './ui/label';

export const Cart: React.FC = () => {
  const { items, total, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please sign in to place an order.');
      return;
    }
    if (!address.trim()) {
      toast.error('Please provide a delivery address.');
      return;
    }

    setIsPlacingOrder(true);
    try {
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        items: items.map(item => ({
          menuItemId: item.menuItemId,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total,
        status: 'pending',
        createdAt: serverTimestamp(),
        deliveryAddress: address
      });

      await clearCart();
      toast.success('Order placed successfully!');
      setAddress('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
        <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full py-6">
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.menuItemId} className="flex gap-4">
              {item.image && (
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover border" referrerPolicy="no-referrer" />
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm">{item.name}</h4>
                  <span className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center text-xs">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={() => removeFromCart(item.menuItemId)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="mt-auto pt-6 space-y-4">
        <Separator />
        <div className="space-y-1.5">
          <Label htmlFor="address">Delivery Address</Label>
          <Input
            id="address"
            placeholder="Enter your full address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={isPlacingOrder}>
          {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
        </Button>
      </div>
    </div>
  );
};
