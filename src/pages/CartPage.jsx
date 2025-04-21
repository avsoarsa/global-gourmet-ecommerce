import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrash, faArrowLeft, faShoppingCart,
  faTimes, faPlus, faMinus
} from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useRegion } from '../context/RegionContext';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { currentUser } = useAuth();
  const { convertPriceSync, currencySymbol } = useRegion();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleApplyCoupon = () => {
    // In a real app, this would validate the coupon with an API
    if (couponCode.toLowerCase() === 'discount10') {
      setCouponApplied(true);
      setCouponDiscount(getCartTotal() * 0.1); // 10% discount
    } else {
      alert('Invalid coupon code');
    }
  };

  const handleCheckout = () => {
    if (currentUser) {
      navigate('/checkout');
    } else {
      navigate('/login');
    }
  };

  // Calculate totals
  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping - couponDiscount;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <FontAwesomeIcon icon={faShoppingCart} className="text-gray-300 text-6xl mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cartItems.map(item => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.weightOption ? (
                          <>
                            {currencySymbol}
                            {(() => {
                              const price = convertPriceSync(item.weightOption.price);
                              return typeof price === 'number' ? price.toFixed(2) : '0.00';
                            })()} ({item.selectedWeight})
                          </>
                        ) : (
                          <>
                            {currencySymbol}
                            {(() => {
                              const price = convertPriceSync(item.price);
                              return typeof price === 'number' ? price.toFixed(2) : '0.00';
                            })()}
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center border border-gray-300 rounded-md w-24">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                          className="w-10 text-center border-x border-gray-300 py-1"
                        />
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {currencySymbol}
                        {(() => {
                          const basePrice = item.weightOption ?
                            convertPriceSync(item.weightOption.price) :
                            convertPriceSync(item.price);
                          const total = typeof basePrice === 'number' ? basePrice * item.quantity : 0;
                          return total.toFixed(2);
                        })()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mb-8">
            <Link
              to="/products"
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Continue Shopping
            </Link>

            <button
              onClick={() => clearCart()}
              className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
            >
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800 font-medium">
                  {currencySymbol}
                  {(() => {
                    const price = convertPriceSync(subtotal);
                    return typeof price === 'number' ? price.toFixed(2) : '0.00';
                  })()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-800 font-medium">
                  {shipping === 0 ? 'Free' : (
                    <>
                      {currencySymbol}
                      {(() => {
                        const price = convertPriceSync(shipping);
                        return typeof price === 'number' ? price.toFixed(2) : '0.00';
                      })()}
                    </>
                  )}
                </span>
              </div>

              {couponApplied && (
                <div className="flex justify-between text-green-600">
                  <span>Discount (10%)</span>
                  <span>
                    -{currencySymbol}
                    {(() => {
                      const price = convertPriceSync(couponDiscount);
                      return typeof price === 'number' ? price.toFixed(2) : '0.00';
                    })()}
                  </span>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>
                    {currencySymbol}
                    {(() => {
                      const price = convertPriceSync(total);
                      return typeof price === 'number' ? price.toFixed(2) : '0.00';
                    })()}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  Including VAT
                </p>
              </div>
            </div>

            {/* Coupon Code */}
            <div className="mt-6">
              <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-1">
                Promo Code
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter code"
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-r-md font-medium transition duration-300"
                >
                  Apply
                </button>
              </div>
              {couponApplied && (
                <p className="text-green-600 text-sm mt-1">
                  Coupon applied successfully!
                </p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                Try "DISCOUNT10" for 10% off
              </p>
            </div>

            {/* Checkout Button */}
            <div className="mt-6">
              {currentUser ? (
                <Link
                  to="/checkout"
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition duration-300 block text-center"
                >
                  Proceed to Checkout
                </Link>
              ) : (
                <Link
                  to="/login"
                  state={{ from: '/checkout' }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition duration-300 block text-center"
                >
                  Sign In to Checkout
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
