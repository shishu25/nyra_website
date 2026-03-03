import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ProductProvider } from './context/ProductContext';
import { BookingProvider } from './context/BookingContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

/* Layouts */
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

/* Public Pages */
import HomePage from './pages/HomePage/HomePage';
import CollectionPage from './pages/CollectionPage/CollectionPage';
import ProductDetailsPage from './pages/ProductDetailsPage/ProductDetailsPage';
import CartPage from './pages/CartPage/CartPage';
import WishlistPage from './pages/WishlistPage/WishlistPage';

/* Admin Pages */
import AdminLogin from './pages/AdminLogin/AdminLogin';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import NotFound from './pages/NotFound/NotFound';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <BookingProvider>
            <CartProvider>
              <WishlistProvider>
                <ScrollToTop />
                <Routes>
                  {/* ── Public Routes (with Navbar + Footer) ── */}
                  <Route element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="collection" element={<CollectionPage />} />
                    <Route path="product/:id" element={<ProductDetailsPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="wishlist" element={<WishlistPage />} />
                  </Route>

                  {/* ── Admin Routes (no public Navbar/Footer) ── */}
                  <Route path="admin" element={<AdminLayout />}>
                    <Route
                      index
                      element={
                        <ProtectedRoute>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="login" element={<AdminLogin />} />
                    <Route path="dashboard" element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="*" element={<NotFound />} />
                  </Route>

                  {/* ── Catch-all 404 ── */}
                  <Route path="*" element={<NotFound />} />
                </Routes>

                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '14px',
                      borderRadius: '12px',
                      padding: '14px 20px',
                    },
                    success: {
                      iconTheme: {
                        primary: '#27ae60',
                        secondary: '#fff',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: '#c0392b',
                        secondary: '#fff',
                      },
                    },
                  }}
                />
              </WishlistProvider>
            </CartProvider>
          </BookingProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
