import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

export const Admin: React.FC = () => {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;

    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orderList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(orderList);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    return unsubscribe;
  }, [isAdmin]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
      toast.success(`Order status updated to ${status}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  if (!isAdmin) return <div className="text-center py-20">Access Denied. Admins only.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
      </div>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Manage Orders</TabsTrigger>
          <TabsTrigger value="menu">Manage Menu (Coming Soon)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders" className="space-y-4 mt-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Order #{order.id.slice(-6).toUpperCase()}</CardTitle>
                  <p className="text-sm text-muted-foreground">User: {order.userId}</p>
                </div>
                <Badge variant="outline">{order.status}</Badge>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Items:</h4>
                    <ul className="text-sm space-y-1">
                      {order.items.map((item: any, idx: number) => (
                        <li key={idx} className="flex justify-between">
                          <span>{item.quantity}x {item.name}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2 pt-2 border-t font-bold flex justify-between">
                      <span>Total:</span>
                      <span>${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Update Status:</h4>
                    <div className="flex flex-wrap gap-2">
                      {['pending', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'].map((status) => (
                        <Button
                          key={status}
                          variant={order.status === status ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, status)}
                        >
                          {status.replace(/-/g, ' ')}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="menu">
          <Card>
            <CardContent className="py-20 text-center text-muted-foreground">
              Menu management interface will be implemented here.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
