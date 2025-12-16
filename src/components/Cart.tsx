import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag, Loader2, MapPin, CreditCard, Truck } from 'lucide-react';
import { CartItem } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { success, error: showError } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
    },
    shippingMethod: 'standard',
    paymentMethod: 'credit_card',
    notes: '',
  });

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + tax + shipping;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      showError('Please sign in to checkout');
      onClose();
      navigate('/signin');
      return;
    }

    if (cart.length === 0) {
      showError('Your cart is empty');
      return;
    }

    setShowCheckoutForm(true);
  };

  const handleSubmitOrder = async () => {
    // Validate required fields
    if (!checkoutData.shippingAddress.street || !checkoutData.shippingAddress.city || 
        !checkoutData.shippingAddress.state || !checkoutData.shippingAddress.zipCode) {
      showError('Please fill in all shipping address fields');
      return;
    }

    // Validate ZIP code format (US format: 5 digits or 5+4 format)
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(checkoutData.shippingAddress.zipCode)) {
      showError('Please enter a valid ZIP code (e.g., 12345 or 12345-6789)');
      return;
    }

    // Validate state (should be 2 letters for US states)
    if (checkoutData.shippingAddress.state.length < 2) {
      showError('Please enter a valid state');
      return;
    }

    setIsCheckingOut(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');

      const orderItems = cart.map(item => ({
        product: (item as any)._id || item.id, // Use MongoDB _id if available, fallback to id
        quantity: item.quantity,
      }));

      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: orderItems,
          shippingAddress: {
            type: 'home',
            ...checkoutData.shippingAddress,
          },
          shippingMethod: checkoutData.shippingMethod,
          paymentMethod: checkoutData.paymentMethod,
          notes: checkoutData.notes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create order');
      }

      const data = await response.json();
      success(`Order placed successfully! Order #${data.data.order.orderNumber}`);
      onCheckout();
      setShowCheckoutForm(false);
      navigate('/orders');
    } catch (err: any) {
      showError(err.message || 'Failed to place order');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full sm:max-w-md bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b flex-shrink-0">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 min-h-0">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingBag className="h-16 w-16 mb-4" />
                <p className="text-lg font-medium">Your cart is empty</p>
                <p className="text-sm">Add some eco-friendly products!</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mb-1">{item.brand}</p>
                        <p className="text-sm sm:text-base font-semibold text-gray-900 mb-2">${item.price}</p>
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 sm:p-2 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                          <span className="text-sm sm:text-base font-medium w-8 sm:w-10 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 sm:p-2 hover:bg-gray-200 rounded transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="p-1.5 sm:p-2 hover:bg-red-100 text-red-600 rounded transition-colors ml-auto"
                            aria-label="Remove item"
                          >
                            <X className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t px-4 sm:px-6 py-4 space-y-4 flex-shrink-0 bg-white">
              {!showCheckoutForm ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm sm:text-base">
                      <span>Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span>Tax</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span>Shipping</span>
                      <span className="font-medium">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    {subtotal < 50 && (
                      <p className="text-xs sm:text-sm text-gray-500 text-center py-1">
                        Add ${(50 - subtotal).toFixed(2)} more for free shipping
                      </p>
                    )}
                    <div className="flex justify-between font-semibold text-base sm:text-lg border-t pt-2 mt-2">
                      <span>Total</span>
                      <span className="text-eco-600">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-eco-500 to-nature-500 hover:from-eco-600 hover:to-nature-600 text-white py-3 sm:py-3.5 rounded-lg font-semibold text-sm sm:text-base transition-all transform active:scale-95 sm:hover:scale-105"
                  >
                    Checkout
                  </button>
                </>
              ) : (
                <div className="space-y-3 sm:space-y-4 max-h-[60vh] sm:max-h-none overflow-y-auto">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base sm:text-lg font-semibold">Shipping Information</h3>
                    <button
                      onClick={() => setShowCheckoutForm(false)}
                      className="text-sm text-gray-600 hover:text-gray-900 underline"
                    >
                      Back
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address</label>
                      <input
                        type="text"
                        value={checkoutData.shippingAddress.street}
                        onChange={(e) => setCheckoutData({
                          ...checkoutData,
                          shippingAddress: { ...checkoutData.shippingAddress, street: e.target.value }
                        })}
                        className="w-full px-3 py-2.5 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-400 focus:border-eco-400"
                        placeholder="123 Main St"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                        <input
                          type="text"
                          value={checkoutData.shippingAddress.city}
                          onChange={(e) => setCheckoutData({
                            ...checkoutData,
                            shippingAddress: { ...checkoutData.shippingAddress, city: e.target.value }
                          })}
                          className="w-full px-3 py-2.5 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-400 focus:border-eco-400"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
                        <input
                          type="text"
                          value={checkoutData.shippingAddress.state}
                          onChange={(e) => setCheckoutData({
                            ...checkoutData,
                            shippingAddress: { ...checkoutData.shippingAddress, state: e.target.value }
                          })}
                          className="w-full px-3 py-2.5 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-400 focus:border-eco-400"
                          placeholder="State"
                          maxLength={2}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">ZIP Code</label>
                      <input
                        type="text"
                        value={checkoutData.shippingAddress.zipCode}
                        onChange={(e) => setCheckoutData({
                          ...checkoutData,
                          shippingAddress: { ...checkoutData.shippingAddress, zipCode: e.target.value }
                        })}
                        className="w-full px-3 py-2.5 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-400 focus:border-eco-400"
                        placeholder="12345"
                        pattern="[0-9]{5}(-[0-9]{4})?"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
                        <Truck className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>Shipping Method</span>
                      </label>
                      <select
                        value={checkoutData.shippingMethod}
                        onChange={(e) => setCheckoutData({ ...checkoutData, shippingMethod: e.target.value })}
                        className="w-full px-3 py-2.5 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-400 focus:border-eco-400 bg-white"
                      >
                        <option value="standard">Standard (5-7 days) - $5.99</option>
                        <option value="express">Express (2-3 days) - $12.99</option>
                        <option value="overnight">Overnight (1 day) - $24.99</option>
                        <option value="pickup">Pickup - Free</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
                        <CreditCard className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>Payment Method</span>
                      </label>
                      <select
                        value={checkoutData.paymentMethod}
                        onChange={(e) => setCheckoutData({ ...checkoutData, paymentMethod: e.target.value })}
                        className="w-full px-3 py-2.5 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-400 focus:border-eco-400 bg-white"
                      >
                        <option value="credit_card">Credit Card</option>
                        <option value="debit_card">Debit Card</option>
                        <option value="paypal">PayPal</option>
                        <option value="stripe">Stripe</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Order Notes (Optional)</label>
                      <textarea
                        value={checkoutData.notes}
                        onChange={(e) => setCheckoutData({ ...checkoutData, notes: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2.5 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-400 focus:border-eco-400 resize-none"
                        placeholder="Special instructions..."
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t bg-gray-50 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 rounded-lg">
                    <div className="flex justify-between text-sm sm:text-base">
                      <span>Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span>Tax</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span>Shipping</span>
                      <span className="font-medium">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-base sm:text-lg border-t pt-2 mt-2">
                      <span>Total</span>
                      <span className="text-eco-600">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={() => setShowCheckoutForm(false)}
                      className="flex-1 px-4 py-2.5 sm:py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base font-medium"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmitOrder}
                      disabled={isCheckingOut}
                      className="flex-1 bg-gradient-to-r from-eco-500 to-nature-500 hover:from-eco-600 hover:to-nature-600 text-white py-2.5 sm:py-2 rounded-lg font-semibold text-sm sm:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center active:scale-95 sm:hover:scale-105"
                    >
                      {isCheckingOut ? (
                        <span className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Processing...</span>
                        </span>
                      ) : (
                        'Place Order'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
};

export default Cart;