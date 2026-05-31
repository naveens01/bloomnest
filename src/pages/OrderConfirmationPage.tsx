import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, MapPin, CreditCard, Download, ArrowRight, Home } from 'lucide-react';

const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  React.useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + (order.shippingMethod === 'overnight' ? 1 : order.shippingMethod === 'express' ? 3 : 7));

  return (
    <main className="min-h-screen bg-eco-pattern pt-20 sm:pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-eco-500 rounded-full mb-4 animate-bounce">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-eco-900 mb-2">Order Confirmed!</h1>
          <p className="text-lg text-eco-600">Thank you for your purchase</p>
        </div>

        {/* Order Number */}
        <div className="bg-gradient-to-r from-eco-500 to-nature-500 rounded-3xl p-6 text-center mb-8 shadow-eco-glow animate-fade-in-up animation-delay-200">
          <p className="text-white text-sm mb-2">Order Number</p>
          <p className="text-white text-2xl sm:text-3xl font-bold">{order.orderNumber}</p>
        </div>

        {/* Order Details */}
        <div className="space-y-6">
          {/* Shipping Info */}
          <div className="bg-white rounded-3xl shadow-eco-glow p-6 border border-eco-200 animate-fade-in-up animation-delay-400">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-eco-100 p-3 rounded-xl">
                <MapPin className="h-6 w-6 text-eco-600" />
              </div>
              <h2 className="text-xl font-bold text-eco-900">Shipping Address</h2>
            </div>
            <div className="text-eco-700 space-y-1">
              <p className="font-semibold">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
              <p className="pt-2">Email: {order.shippingAddress.email}</p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Delivery Estimate */}
          <div className="bg-white rounded-3xl shadow-eco-glow p-6 border border-eco-200 animate-fade-in-up animation-delay-600">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-eco-100 p-3 rounded-xl">
                <Truck className="h-6 w-6 text-eco-600" />
              </div>
              <h2 className="text-xl font-bold text-eco-900">Delivery Information</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-eco-700">Shipping Method</span>
                <span className="font-semibold text-eco-900 capitalize">{order.shippingMethod} Shipping</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-eco-700">Estimated Delivery</span>
                <span className="font-semibold text-eco-900">{estimatedDelivery.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="bg-eco-50 rounded-xl p-4 mt-4">
                <p className="text-sm text-eco-700">
                  We'll send you a shipping confirmation email with tracking information once your order ships.
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-3xl shadow-eco-glow p-6 border border-eco-200 animate-fade-in-up animation-delay-800">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-eco-100 p-3 rounded-xl">
                <Package className="h-6 w-6 text-eco-600" />
              </div>
              <h2 className="text-xl font-bold text-eco-900">Order Items</h2>
            </div>
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center space-x-4 pb-4 border-b border-eco-100 last:border-0">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                  <div className="flex-1">
                    <p className="font-semibold text-eco-900">{item.name}</p>
                    <p className="text-sm text-eco-600">{item.brand}</p>
                    <p className="text-sm text-eco-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-eco-700">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-3xl shadow-eco-glow p-6 border border-eco-200 animate-fade-in-up animation-delay-1000">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-eco-100 p-3 rounded-xl">
                <CreditCard className="h-6 w-6 text-eco-600" />
              </div>
              <h2 className="text-xl font-bold text-eco-900">Payment Summary</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-eco-700">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-eco-700">
                <span>Shipping</span>
                <span>{order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-eco-700">
                <span>Tax</span>
                <span>₹{order.tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-eco-200 pt-3 flex justify-between text-xl font-bold text-eco-900">
                <span>Total</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
              <div className="bg-eco-50 rounded-xl p-4 mt-4">
                <p className="text-sm text-eco-700">
                  Paid with card ending in {order.paymentInfo.last4}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up animation-delay-1200">
            <Link
              to="/profile"
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-eco-500 to-nature-500 text-white px-6 py-4 rounded-2xl font-semibold hover:shadow-eco-glow-lg transition-all duration-300 hover:scale-105"
            >
              <Package className="h-5 w-5" />
              <span>View Order History</span>
            </Link>
            <Link
              to="/"
              className="flex items-center justify-center space-x-2 border-2 border-eco-200 text-eco-700 px-6 py-4 rounded-2xl font-semibold hover:bg-eco-50 transition-all duration-300"
            >
              <Home className="h-5 w-5" />
              <span>Continue Shopping</span>
            </Link>
          </div>

          {/* Email Confirmation Notice */}
          <div className="bg-gradient-to-r from-eco-50 to-nature-50 rounded-2xl p-6 border border-eco-200 text-center animate-fade-in-up animation-delay-1400">
            <p className="text-eco-700">
              A confirmation email has been sent to <span className="font-semibold">{order.shippingAddress.email}</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderConfirmationPage;

// Made with Bob
