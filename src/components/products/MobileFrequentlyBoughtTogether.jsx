import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { products } from '../../data/products';
import { useRegion } from '../../context/RegionContext';
import LazyImage from '../common/LazyImage';

const MobileFrequentlyBoughtTogether = ({ product }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const { addToCart } = useCart();
  const { convertPriceSync, currencySymbol } = useRegion();

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
    <div className="mt-8 bg-white rounded-lg p-4 md:hidden">
      <h3 className="text-lg font-semibold mb-3">Frequently Bought Together</h3>

      <div className="space-y-3 mb-4">
        {/* Main product */}
        <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
          <input
            type="checkbox"
            id={`mobile-product-${product?.id}`}
            checked={selectedProducts[product?.id] || false}
            onChange={() => toggleProduct(product?.id)}
            className="h-5 w-5 text-green-600 rounded"
          />
          <div className="flex items-center gap-3 flex-1">
            <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
              <LazyImage
                src={product?.image}
                alt={product?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm line-clamp-2">{product?.name}</p>
              <p className="text-sm text-green-700 font-medium">
                {currencySymbol}
                {(() => {
                  const price = convertPriceSync(product?.price);
                  return typeof price === 'number' ? price.toFixed(2) : '0.00';
                })()}
              </p>
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.map((relatedProduct) => (
          <div key={relatedProduct.id} className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <input
              type="checkbox"
              id={`mobile-product-${relatedProduct.id}`}
              checked={selectedProducts[relatedProduct.id] || false}
              onChange={() => toggleProduct(relatedProduct.id)}
              className="h-5 w-5 text-green-600 rounded"
            />
            <div className="flex items-center gap-3 flex-1">
              <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                <LazyImage
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <Link to={`/product/${relatedProduct.id}`} className="font-medium text-sm line-clamp-2">
                  {relatedProduct.name}
                </Link>
                <p className="text-sm text-green-700 font-medium">
                  {currencySymbol}
                  {(() => {
                    const price = convertPriceSync(relatedProduct.price);
                    return typeof price === 'number' ? price.toFixed(2) : '0.00';
                  })()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-3 rounded-md flex justify-between items-center">
        <div>
          <p className="text-sm font-medium">
            Total: {currencySymbol}
            {(() => {
              const price = convertPriceSync(totalPrice);
              return typeof price === 'number' ? price.toFixed(2) : '0.00';
            })()}
          </p>
          <p className="text-xs text-gray-600">
            {Object.values(selectedProducts).filter(Boolean).length} items
          </p>
        </div>
        <button
          onClick={addAllToCart}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Add All to Cart
        </button>
      </div>
    </div>
  );
};

export default MobileFrequentlyBoughtTogether;
