import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, UtensilsCrossed, History, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Auth } from './Auth';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Cart } from './Cart';

export const Navbar: React.FC = () => {
  const { items } = useCart();
  const { isAdmin, user } = useAuth();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <UtensilsCrossed className="w-6 h-6" />
          <span>QuickBite</span>
        </Link>

        <div className="flex items-center gap-2 md:gap-6">
          {user && (
            <div className="hidden md:flex items-center gap-4">
              <Link to="/orders">
                <Button variant="ghost" className="gap-2">
                  <History className="w-4 h-4" />
                  Orders
                </Button>
              </Link>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" className="gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Admin
                  </Button>
                </Link>
              )}
            </div>
          )}

          <Sheet>
            <SheetTrigger
              render={(props) => (
                <Button {...props} variant="outline" size="icon" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 px-1.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              )}
            />
            <SheetContent className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Your Cart
                </SheetTitle>
              </SheetHeader>
              <Cart />
            </SheetContent>
          </Sheet>

          <Auth />
        </div>
      </div>
    </nav>
  );
};
