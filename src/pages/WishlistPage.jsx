import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faArrowLeft, faHeart, faShoppingCart, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import SocialShare from '../components/common/SocialShare';

const WishlistPage = () => {
  const { wishlistItems: wishlistIds, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [wishlistProducts, setWishlistProducts] = useState([]);

  // Load wishlist items
  useEffect(() => {
    const items = products.filter(product => wishlistIds.includes(product.id));
    setWishlistProducts(items);
  }, [wishlistIds]);

  // Add item to cart and optionally remove from wishlist
  const addToCartFromWishlist = (product, removeAfterAdd = false) => {
    addToCart(product);
    if (removeAfterAdd) {
      removeFromWishlist(product.id);
    }
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <FontAwesomeIcon icon={faHeart} className="text-gray-300 text-6xl mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">
            You haven't added any products to your wishlist yet.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>

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
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {wishlistProducts.map(item => (
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
                  <div className="text-sm text-gray-900">${item.price.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-4 justify-end">
                    <Link
                      to={`/product/${item.id}`}
                      className="text-green-600 hover:text-green-900"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => addToCartFromWishlist(item)}
                      className="text-green-600 hover:text-green-900"
                      title="Add to Cart"
                    >
                      <FontAwesomeIcon icon={faShoppingCart} />
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Remove from Wishlist"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <Link
          to="/products"
          className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Continue Shopping
        </Link>

        <div className="flex items-center">
          <span className="mr-3 text-gray-700">Share your wishlist:</span>
          <SocialShare
            compact={true}
            title="Check out my wishlist on Global Gourmet"
            description={`My wishlist contains ${wishlistProducts.length} items including ${wishlistProducts.map(p => p.name).slice(0, 3).join(', ')}${wishlistProducts.length > 3 ? '...' : ''}`}
          />
        </div>
      </div>

      {/* Social Sharing Section */}
      <div className="mt-12 mb-16 bg-gray-50 p-8 rounded-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Share Your Wishlist</h2>
          <p className="text-gray-600 mb-4">Share your wishlist with friends and family!</p>
          <div className="flex justify-center">
            <SocialShare
              title="Check out my wishlist on Global Gourmet"
              description={`My wishlist contains ${wishlistProducts.length} items including ${wishlistProducts.map(p => p.name).slice(0, 3).join(', ')}${wishlistProducts.length > 3 ? '...' : ''}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
