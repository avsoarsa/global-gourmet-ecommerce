import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { products } from '../../data/products';
import { formatCurrency } from '../../services/currencyService';
import { useRegion } from '../../context/RegionContext';
import LazyImage from '../common/LazyImage';

const FrequentlyBoughtTogether = ({ product }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const { addToCart } = useCart();
  const { currency, exchangeRate } = useRegion();

  // Find related products based on category and tags
  useEffect(() => {
    if (!product) return;

    // Get products in the same category, excluding the current product
    const sameCategory = products.filter(
      p => p.category === product.category && p.id !== product.id
    );

    // Sort by relevance (for now, just randomize)
    const shuffled = [...sameCategory].sort(() => 0.5 - Math.random());

    // Take 2-3 related products
    const selected = shuffled.slice(0, Math.min(3, shuffled.length));

    setRelatedProducts(selected);

    // Initialize all products as selected
    const initialSelected = { [product.id]: true };
    selected.forEach(p => {
      initialSelected[p.id] = true;
    });

    setSelectedProducts(initialSelected);
  }, [product]);

  // Calculate total price when selections change
  useEffect(() => {
    let total = 0;

    // Add main product price if selected
    if (selectedProducts[product?.id]) {
      total += product?.price || 0;
    }

    // Add related product prices if selected
    relatedProducts.forEach(p => {
      if (selectedProducts[p.id]) {
        total += p.price;
      }
    });

    setTotalPrice(total);
  }, [selectedProducts, product, relatedProducts]);

  // Toggle product selection
  const toggleProduct = (productId) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Add all selected products to cart
  const addAllToCart = () => {
    // Add main product if selected
    if (selectedProducts[product?.id]) {
      addToCart(product, 1);
    }

    // Add related products if selected
    relatedProducts.forEach(p => {
      if (selectedProducts[p.id]) {
        addToCart(p, 1);
      }
    });
  };

  // If no related products, don't render the component
  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-12 bg-gray-50 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Frequently Bought Together</h3>

      <div className="flex flex-col md:flex-row items-start gap-4 mb-6">
        {/* Main product */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id={`product-${product?.id}`}
            checked={selectedProducts[product?.id] || false}
            onChange={() => toggleProduct(product?.id)}
            className="h-4 w-4 text-green-600 focus:ring-green-500 rounded"
          />
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-16 h-16 flex-shrink-0">
              <LazyImage
                src={product?.image}
                alt={product?.name}
                className="w-full h-full object-cover rounded"
              />
            </div>
            <div>
              <p className="font-medium">{product?.name}</p>
              <p className="text-sm text-gray-600">{formatCurrency(product?.price * exchangeRate, currency)}</p>
            </div>
          </div>
        </div>

        {/* Plus signs between products */}
        {relatedProducts.map((relatedProduct, index) => (
          <div key={relatedProduct.id} className="flex items-center gap-3">
            <div className="text-gray-400 text-xl mx-2 hidden md:block">+</div>
            <input
              type="checkbox"
              id={`product-${relatedProduct.id}`}
              checked={selectedProducts[relatedProduct.id] || false}
              onChange={() => toggleProduct(relatedProduct.id)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 rounded"
            />
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-16 h-16 flex-shrink-0">
                <LazyImage
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div>
                <Link to={`/product/${relatedProduct.id}`} className="font-medium hover:text-green-600">
                  {relatedProduct.name}
                </Link>
                <p className="text-sm text-gray-600">{formatCurrency(relatedProduct.price * exchangeRate, currency)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-lg font-semibold">
            Total: {formatCurrency(totalPrice * exchangeRate, currency)}
          </p>
          <p className="text-sm text-gray-600">
            {Object.values(selectedProducts).filter(Boolean).length} items selected
          </p>
        </div>
        <button
          onClick={addAllToCart}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors duration-300"
        >
          Add All to Cart
        </button>
      </div>
    </div>
  );
};

export default FrequentlyBoughtTogether;
