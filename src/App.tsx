import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Menu } from './components/Menu';
import { OrderHistory } from './components/OrderHistory';
import { Admin } from './components/Admin';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { ErrorBoundary } from './components/ErrorBoundary';

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-background font-sans antialiased">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={
                      <PageWrapper>
                        <div className="space-y-8">
                          <div className="text-center space-y-4 max-w-2xl mx-auto">
                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                              Delicious food, <span className="text-primary">delivered</span> to you.
                            </h1>
                            <p className="text-xl text-muted-foreground">
                              Choose your favorite meal from our broad selection of available meals and enjoy a delicious lunch or dinner at home.
                            </p>
                          </div>
                          <Menu />
                        </div>
                      </PageWrapper>
                    } />
                    <Route path="/orders" element={
                      <PageWrapper>
                        <OrderHistory />
                      </PageWrapper>
                    } />
                    <Route path="/admin" element={
                      <PageWrapper>
                        <Admin />
                      </PageWrapper>
                    } />
                  </Routes>
                </AnimatePresence>
              </main>
              <Toaster position="bottom-right" />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
