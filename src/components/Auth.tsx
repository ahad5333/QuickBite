import React from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';

export const Auth: React.FC = () => {
  const { user, loading } = useAuth();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Successfully signed in!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to sign in. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to sign out.');
    }
  };

  if (loading) return <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />;

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-medium">{user.displayName}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
        {user.photoURL ? (
          <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full border" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-primary" />
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={handleLogout} title="Sign Out">
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={handleLogin} className="gap-2">
      <LogIn className="w-4 h-4" />
      Sign In
    </Button>
  );
};
