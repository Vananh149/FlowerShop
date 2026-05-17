import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster as HotToaster } from "react-hot-toast";
import Layout from "./layouts/Layout";
import Home from "./ui/home/Home";
import Shop from "./ui/shop/Shop";
import ProductDetail from "./ui/productDetail/ProductDetail";
import About from "./ui/about/About";
import Contact from "./ui/contact/Contact";
import Reviews from "./ui/reviews/Reviews";
import LoginPage from "./ui/login/LoginPage";
import RegisterPage from "./ui/register/RegisterPage";
import ProfilePage from "./ui/profile/ProfilePage";
import CartPage from "./ui/cart/CartPage";
import CheckoutPage from "./ui/checkout/CheckoutPage";
import OrderSuccess from "./ui/orderSuccess/OrderSuccess";
import WishlistPage from "./ui/wishlist/WishlistPage";
import OrdersPage from "./ui/orders/OrdersPage";
import OrderDetail from "./ui/orders/OrderDetail";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import WriteReviewPage from "./ui/reviews/WriteReviewPage";
import AdminLayout from "./ui/admin/AdminLayout";
import AdminDashboard from "./ui/admin/AdminDashboard";
import AdminOrders from "./ui/admin/AdminOrders";
import AdminProducts from "./ui/admin/AdminProducts";
import AdminReviews from "./ui/admin/AdminReviews";
import AdminProfile from "./ui/admin/AdminProfile";
import ScrollToTop from "./ui/shared/ScrollToTop";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

const AppContent = () => {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (user?.isAdmin === true || user?.role === 'admin') {
        return (
            <Routes>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="reviews" element={<AdminReviews />} />
                    <Route path="profile" element={<AdminProfile />} />
                </Route>
                <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
        );
    }

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="shop" element={<Shop />} />
                <Route path="shop/:id" element={<ProductDetail />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="reviews" element={<Reviews />} />
                <Route path="write-review" element={<ProtectedRoute><WriteReviewPage /></ProtectedRoute>} />
                <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
                <Route path="wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
                <Route path="orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                <Route path="orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <ScrollToTop />
            <HotToaster />
            <AppContent />
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;