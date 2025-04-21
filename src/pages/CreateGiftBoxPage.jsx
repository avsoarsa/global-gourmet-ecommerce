import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { giftBoxes } from '../data/products';
import { useCart } from '../context/CartContext';
import { useRegion } from '../context/RegionContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBoxOpen, faGift, faCheck, faArrowRight,
  faPlus, faMinus, faTrash, faShoppingCart
} from '@fortawesome/free-solid-svg-icons';

const CreateGiftBoxPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { convertPriceSync, currencySymbol } = useRegion();
  const queryParams = new URLSearchParams(location.search);
  const boxId = queryParams.get('boxId');

  // State for tracking the current step
  const [currentStep, setCurrentStep] = useState(1);
  // State for selected products
  const [selectedProducts, setSelectedProducts] = useState([]);
  // State for box customization
  const [boxCustomization, setBoxCustomization] = useState({
    boxSize: 'medium',
    boxColor: 'natural',
    includingMessage: false,
    message: '',
  });

  // Load predesigned gift box if boxId is provided
  useEffect(() => {
    if (boxId) {
      const selectedBox = giftBoxes.find(box => box.id === parseInt(boxId));
      if (selectedBox) {
        // Convert gift box contents to product objects
        const boxProducts = selectedBox.contents.map((name, index) => ({
          id: 1000 + index, // Use a unique ID range
          name: name,
          price: 0, // We'll calculate this from the total box price
          image: 'https://images.unsplash.com/photo-1574570301597-a98a0a5c0e76?q=80&w=300&auto=format&fit=crop',
          quantity: 1
        }));

        setSelectedProducts(boxProducts);

        // Set a default box size based on the number of items
        const itemCount = selectedBox.contents.length;
        let boxSize = 'medium';
        if (itemCount <= 4) boxSize = 'small';
        else if (itemCount >= 8) boxSize = 'large';

        setBoxCustomization({
          ...boxCustomization,
          boxSize: boxSize
        });
      }
    }
  }, [boxId]);

  // Placeholder for product data (will be replaced with actual data later)
  const productCategories = [
    {
      id: 1,
      name: 'Dry Fruits',
      products: [
        { id: 101, name: 'Premium Almonds', price: 12.99, image: 'https://images.unsplash.com/photo-1574570301597-a98a0a5c0e76?q=80&w=300&auto=format&fit=crop' },
        { id: 102, name: 'Cashews', price: 14.99, image: 'https://images.unsplash.com/photo-1574570301597-a98a0a5c0e76?q=80&w=300&auto=format&fit=crop' },
        { id: 103, name: 'Pistachios', price: 16.99, image: 'https://images.unsplash.com/photo-1574570301597-a98a0a5c0e76?q=80&w=300&auto=format&fit=crop' },
      ]
    },
    {
      id: 2,
      name: 'Spices',
      products: [
        { id: 201, name: 'Cinnamon Sticks', price: 8.99, image: 'https://images.unsplash.com/photo-1574570301597-a98a0a5c0e76?q=80&w=300&auto=format&fit=crop' },
        { id: 202, name: 'Cardamom Pods', price: 9.99, image: 'https://images.unsplash.com/photo-1574570301597-a98a0a5c0e76?q=80&w=300&auto=format&fit=crop' },
        { id: 203, name: 'Saffron Threads', price: 24.99, image: 'https://images.unsplash.com/photo-1574570301597-a98a0a5c0e76?q=80&w=300&auto=format&fit=crop' },
      ]
    },
    {
      id: 3,
      name: 'Dried Fruits',
      products: [
        { id: 301, name: 'Dried Apricots', price: 10.99, image: 'https://images.unsplash.com/photo-1574570301597-a98a0a5c0e76?q=80&w=300&auto=format&fit=crop' },
        { id: 302, name: 'Dried Cranberries', price: 9.99, image: 'https://images.unsplash.com/photo-1574570301597-a98a0a5c0e76?q=80&w=300&auto=format&fit=crop' },
        { id: 303, name: 'Dried Figs', price: 11.99, image: 'https://images.unsplash.com/photo-1574570301597-a98a0a5c0e76?q=80&w=300&auto=format&fit=crop' },
      ]
    }
  ];

  // Function to handle adding a product to the box
  const addProductToBox = (product) => {
    const existingProduct = selectedProducts.find(p => p.id === product.id);

    if (existingProduct) {
      // If product already exists, increase quantity
      setSelectedProducts(
        selectedProducts.map(p =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        )
      );
    } else {
      // Add new product with quantity 1
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  // Function to handle removing a product from the box
  const removeProductFromBox = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  // Function to update product quantity
  const updateProductQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeProductFromBox(productId);
      return;
    }

    setSelectedProducts(
      selectedProducts.map(p =>
        p.id === productId
          ? { ...p, quantity: newQuantity }
          : p
      )
    );
  };

  // Function to handle box customization changes
  const handleCustomizationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBoxCustomization({
      ...boxCustomization,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    const productsTotal = selectedProducts.reduce(
      (total, product) => total + (product.price * product.quantity),
      0
    );

    // Add box price based on size
    let boxPrice = 0;
    switch(boxCustomization.boxSize) {
      case 'small': boxPrice = 5.99; break;
      case 'medium': boxPrice = 8.99; break;
      case 'large': boxPrice = 12.99; break;
      default: boxPrice = 8.99;
    }

    return (productsTotal + boxPrice).toFixed(2);
  };

  // Function to go to next step
  const goToNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  // Function to go to previous step
  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Function to add the custom gift box to cart
  const handleAddToCart = () => {
    // Create a custom gift box product
    const customGiftBox = {
      id: `custom-box-${Date.now()}`, // Generate a unique ID
      name: `Custom Gift Box (${boxCustomization.boxSize})`,
      price: parseFloat(calculateTotalPrice()),
      image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=1000&auto=format&fit=crop',
      description: `A custom gift box with ${selectedProducts.length} items. Box color: ${boxCustomization.boxColor}.`,
      isCustomBox: true,
      boxDetails: {
        products: selectedProducts,
        customization: boxCustomization
      }
    };

    // Add to cart
    addToCart(customGiftBox, 1);

    // Navigate to cart page
    navigate('/cart');
  };

  return (
    <div className="pt-16 pb-24">
      {/* Main Content Container */}
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center my-8">Create Your Custom Gift Box</h1>
        {/* Step Progress Indicator */}
        <div className="mb-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
              {/* Step 1: Select Products */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'} mb-2`}>
                  {currentStep > 1 ? <FontAwesomeIcon icon={faCheck} /> : 1}
                </div>
                <div className="text-center">
                  <p className={`font-medium ${currentStep >= 1 ? 'text-green-600' : 'text-gray-500'}`}>Select Products</p>
                </div>
              </div>

              {/* Connector Line */}
              <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-green-600' : 'bg-gray-200'}`}></div>

              {/* Step 2: Customize Box */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'} mb-2`}>
                  {currentStep > 2 ? <FontAwesomeIcon icon={faCheck} /> : 2}
                </div>
                <div className="text-center">
                  <p className={`font-medium ${currentStep >= 2 ? 'text-green-600' : 'text-gray-500'}`}>Customize Box</p>
                </div>
              </div>

              {/* Connector Line */}
              <div className={`flex-1 h-1 mx-2 ${currentStep >= 3 ? 'bg-green-600' : 'bg-gray-200'}`}></div>

              {/* Step 3: Review & Checkout */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'} mb-2`}>
                  {currentStep > 3 ? <FontAwesomeIcon icon={faCheck} /> : 3}
                </div>
                <div className="text-center">
                  <p className={`font-medium ${currentStep >= 3 ? 'text-green-600' : 'text-gray-500'}`}>Review & Checkout</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step Content Container */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          {/* Step 1: Product Selection */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Select Products for Your Gift Box</h2>
              <p className="text-gray-600 mb-8">
                Choose from our premium selection of dry fruits, nuts, and spices to create your perfect gift box.
                We recommend selecting 4-8 items for a well-balanced gift box.
              </p>

              {/* Product Categories */}
              <div className="mb-12">
                {productCategories.map(category => (
                  <div key={category.id} className="mb-10">
                    <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">{category.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {category.products.map(product => {
                        const isSelected = selectedProducts.some(p => p.id === product.id);
                        const selectedProduct = selectedProducts.find(p => p.id === product.id);

                        return (
                          <div
                            key={product.id}
                            className={`border rounded-lg overflow-hidden transition-all duration-300 ${isSelected ? 'border-green-500 shadow-md' : 'border-gray-200 hover:shadow-md'}`}
                          >
                            <div className="relative">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-48 object-cover"
                              />
                              {isSelected && (
                                <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                                  <FontAwesomeIcon icon={faCheck} size="xs" />
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <h4 className="font-semibold mb-1">{product.name}</h4>
                              <p className="text-green-600 font-medium mb-3">
                                {currencySymbol}
                                {(() => {
                                  const price = convertPriceSync(product.price);
                                  return typeof price === 'number' ? price.toFixed(2) : '0.00';
                                })()}
                              </p>

                              {!isSelected ? (
                                <button
                                  onClick={() => addProductToBox(product)}
                                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition duration-300 flex items-center justify-center"
                                >
                                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                  Add to Box
                                </button>
                              ) : (
                                <div className="flex items-center justify-between">
                                  <button
                                    onClick={() => updateProductQuantity(product.id, (selectedProduct?.quantity || 0) - 1)}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center transition duration-300"
                                  >
                                    <FontAwesomeIcon icon={faMinus} size="xs" />
                                  </button>

                                  <span className="font-medium">{selectedProduct?.quantity || 0}</span>

                                  <button
                                    onClick={() => updateProductQuantity(product.id, (selectedProduct?.quantity || 0) + 1)}
                                    className="bg-green-100 hover:bg-green-200 text-green-700 w-8 h-8 rounded-full flex items-center justify-center transition duration-300"
                                  >
                                    <FontAwesomeIcon icon={faPlus} size="xs" />
                                  </button>

                                  <button
                                    onClick={() => removeProductFromBox(product.id)}
                                    className="bg-red-100 hover:bg-red-200 text-red-600 w-8 h-8 rounded-full flex items-center justify-center ml-2 transition duration-300"
                                  >
                                    <FontAwesomeIcon icon={faTrash} size="xs" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Products Summary */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4">Your Gift Box Summary</h3>

                {selectedProducts.length === 0 ? (
                  <p className="text-gray-500 italic">No products selected yet. Add some products to your gift box!</p>
                ) : (
                  <div>
                    <div className="mb-4">
                      <div className="flex justify-between font-medium text-gray-700 mb-2">
                        <span>Selected Items:</span>
                        <span>{selectedProducts.length} products</span>
                      </div>
                      <div className="flex justify-between font-medium text-gray-700">
                        <span>Total Quantity:</span>
                        <span>{selectedProducts.reduce((total, product) => total + product.quantity, 0)} items</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Estimated Total:</span>
                        <span className="text-green-600">
                          {currencySymbol}
                          {(() => {
                            const price = convertPriceSync(parseFloat(calculateTotalPrice()));
                            return typeof price === 'number' ? price.toFixed(2) : '0.00';
                          })()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Final price will be calculated after box customization</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <Link
                  to="/gift-boxes"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-md font-medium transition duration-300"
                >
                  Cancel
                </Link>

                <button
                  onClick={goToNextStep}
                  disabled={selectedProducts.length === 0}
                  className={`flex items-center px-6 py-2 rounded-md font-medium transition duration-300 ${selectedProducts.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                >
                  Continue to Customization
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Box Customization */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Customize Your Gift Box</h2>
              <p className="text-gray-600 mb-8">
                Personalize your gift box by selecting the size, color, and adding a custom message if desired.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Left Column - Box Options */}
                <div>
                  {/* Box Size Selection */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Box Size</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div
                        className={`border rounded-lg p-4 text-center cursor-pointer transition-all duration-300 ${boxCustomization.boxSize === 'small' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}
                        onClick={() => setBoxCustomization({...boxCustomization, boxSize: 'small'})}
                      >
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-green-700 font-semibold">S</span>
                        </div>
                        <p className="font-medium">Small</p>
                        <p className="text-sm text-gray-500">3-5 items</p>
                        <p className="text-green-600 font-medium mt-2">
                          {currencySymbol}
                          {(() => {
                            const price = convertPriceSync(5.99);
                            return typeof price === 'number' ? price.toFixed(2) : '0.00';
                          })()}
                        </p>
                      </div>

                      <div
                        className={`border rounded-lg p-4 text-center cursor-pointer transition-all duration-300 ${boxCustomization.boxSize === 'medium' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}
                        onClick={() => setBoxCustomization({...boxCustomization, boxSize: 'medium'})}
                      >
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-green-700 font-semibold">M</span>
                        </div>
                        <p className="font-medium">Medium</p>
                        <p className="text-sm text-gray-500">5-8 items</p>
                        <p className="text-green-600 font-medium mt-2">
                          {currencySymbol}
                          {(() => {
                            const price = convertPriceSync(8.99);
                            return typeof price === 'number' ? price.toFixed(2) : '0.00';
                          })()}
                        </p>
                      </div>

                      <div
                        className={`border rounded-lg p-4 text-center cursor-pointer transition-all duration-300 ${boxCustomization.boxSize === 'large' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}
                        onClick={() => setBoxCustomization({...boxCustomization, boxSize: 'large'})}
                      >
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-green-700 font-semibold">L</span>
                        </div>
                        <p className="font-medium">Large</p>
                        <p className="text-sm text-gray-500">8-12 items</p>
                        <p className="text-green-600 font-medium mt-2">
                          {currencySymbol}
                          {(() => {
                            const price = convertPriceSync(12.99);
                            return typeof price === 'number' ? price.toFixed(2) : '0.00';
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Box Color Selection */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Box Color</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div
                        className={`border rounded-lg p-4 text-center cursor-pointer transition-all duration-300 ${boxCustomization.boxColor === 'natural' ? 'border-green-500' : 'border-gray-200 hover:border-green-300'}`}
                        onClick={() => setBoxCustomization({...boxCustomization, boxColor: 'natural'})}
                      >
                        <div className="w-12 h-12 bg-amber-100 rounded-full mx-auto mb-2 border border-amber-200"></div>
                        <p className="font-medium">Natural</p>
                      </div>

                      <div
                        className={`border rounded-lg p-4 text-center cursor-pointer transition-all duration-300 ${boxCustomization.boxColor === 'green' ? 'border-green-500' : 'border-gray-200 hover:border-green-300'}`}
                        onClick={() => setBoxCustomization({...boxCustomization, boxColor: 'green'})}
                      >
                        <div className="w-12 h-12 bg-green-200 rounded-full mx-auto mb-2 border border-green-300"></div>
                        <p className="font-medium">Green</p>
                      </div>

                      <div
                        className={`border rounded-lg p-4 text-center cursor-pointer transition-all duration-300 ${boxCustomization.boxColor === 'black' ? 'border-green-500' : 'border-gray-200 hover:border-green-300'}`}
                        onClick={() => setBoxCustomization({...boxCustomization, boxColor: 'black'})}
                      >
                        <div className="w-12 h-12 bg-gray-800 rounded-full mx-auto mb-2 border border-gray-700"></div>
                        <p className="font-medium">Black</p>
                      </div>
                    </div>
                  </div>

                  {/* Gift Message */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Gift Message</h3>
                    <div className="mb-4">
                      <div className="flex items-center mb-4">
                        <input
                          type="checkbox"
                          id="includeMessage"
                          name="includingMessage"
                          checked={boxCustomization.includingMessage}
                          onChange={handleCustomizationChange}
                          className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                        />
                        <label htmlFor="includeMessage" className="ml-2 text-gray-700">Include a personalized message</label>
                      </div>

                      {boxCustomization.includingMessage && (
                        <textarea
                          name="message"
                          value={boxCustomization.message}
                          onChange={handleCustomizationChange}
                          placeholder="Enter your gift message here..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          rows="4"
                          maxLength="200"
                        ></textarea>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Preview */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Your Gift Box Preview</h3>
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className={`w-full h-48 rounded-lg mb-4 flex items-center justify-center ${boxCustomization.boxColor === 'natural' ? 'bg-amber-100' : boxCustomization.boxColor === 'green' ? 'bg-green-200' : 'bg-gray-800'}`}>
                      <div className="text-center p-4 bg-white bg-opacity-80 rounded-lg">
                        <FontAwesomeIcon icon={faGift} className="text-green-600 text-3xl mb-2" />
                        <p className="font-medium text-gray-800">Custom Gift Box</p>
                        <p className="text-sm text-gray-600">{boxCustomization.boxSize.charAt(0).toUpperCase() + boxCustomization.boxSize.slice(1)} Size</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Box Contents:</h4>
                      {selectedProducts.length === 0 ? (
                        <p className="text-gray-500 italic">No products selected</p>
                      ) : (
                        <ul className="list-disc list-inside text-gray-700">
                          {selectedProducts.map(product => (
                            <li key={product.id}>
                              {product.name} <span className="text-gray-500">x{product.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {boxCustomization.includingMessage && boxCustomization.message && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Gift Message:</h4>
                        <div className="bg-white p-3 rounded border border-gray-200 italic text-gray-700">
                          "{boxCustomization.message}"
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span className="text-green-600">{currencySymbol}{convertPrice(parseFloat(calculateTotalPrice())).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={goToPreviousStep}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-md font-medium transition duration-300"
                >
                  Back to Products
                </button>

                <button
                  onClick={goToNextStep}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition duration-300 flex items-center"
                >
                  Review Order
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Checkout */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Review Your Custom Gift Box</h2>
              <p className="text-gray-600 mb-8">
                Please review your custom gift box details before adding to cart.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Left Column - Box Preview */}
                  <div className="md:w-1/3">
                    <h3 className="text-lg font-semibold mb-4">Gift Box Preview</h3>
                    <div className={`w-full h-48 rounded-lg mb-4 flex items-center justify-center ${boxCustomization.boxColor === 'natural' ? 'bg-amber-100' : boxCustomization.boxColor === 'green' ? 'bg-green-200' : 'bg-gray-800'}`}>
                      <div className="text-center p-4 bg-white bg-opacity-80 rounded-lg">
                        <FontAwesomeIcon icon={faGift} className="text-green-600 text-3xl mb-2" />
                        <p className="font-medium text-gray-800">Custom Gift Box</p>
                        <p className="text-sm text-gray-600">{boxCustomization.boxSize.charAt(0).toUpperCase() + boxCustomization.boxSize.slice(1)} Size</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="font-semibold mb-2">Box Details:</h4>
                      <ul className="text-gray-700 space-y-2">
                        <li><span className="font-medium">Size:</span> {boxCustomization.boxSize.charAt(0).toUpperCase() + boxCustomization.boxSize.slice(1)}</li>
                        <li><span className="font-medium">Color:</span> {boxCustomization.boxColor.charAt(0).toUpperCase() + boxCustomization.boxColor.slice(1)}</li>
                        <li><span className="font-medium">Gift Message:</span> {boxCustomization.includingMessage ? 'Yes' : 'No'}</li>
                      </ul>
                    </div>
                  </div>

                  {/* Right Column - Order Summary */}
                  <div className="md:w-2/3">
                    <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                    {/* Products Table */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Quantity</th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Price</th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedProducts.map(product => (
                            <tr key={product.id}>
                              <td className="px-4 py-3 text-sm text-gray-700">{product.name}</td>
                              <td className="px-4 py-3 text-sm text-gray-700 text-center">{product.quantity}</td>
                              <td className="px-4 py-3 text-sm text-gray-700 text-right">{currencySymbol}{convertPrice(product.price).toFixed(2)}</td>
                              <td className="px-4 py-3 text-sm text-gray-700 text-right">{currencySymbol}{convertPrice(product.price * product.quantity).toFixed(2)}</td>
                            </tr>
                          ))}

                          {/* Box Price */}
                          <tr className="bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {boxCustomization.boxSize.charAt(0).toUpperCase() + boxCustomization.boxSize.slice(1)} Gift Box ({boxCustomization.boxColor})
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 text-center">1</td>
                            <td className="px-4 py-3 text-sm text-gray-700 text-right">
                              {currencySymbol}{convertPrice(
                                boxCustomization.boxSize === 'small' ? 5.99 :
                                boxCustomization.boxSize === 'medium' ? 8.99 : 12.99
                              ).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 text-right">
                              {currencySymbol}{convertPrice(
                                boxCustomization.boxSize === 'small' ? 5.99 :
                                boxCustomization.boxSize === 'medium' ? 8.99 : 12.99
                              ).toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                        <tfoot className="bg-gray-50 border-t border-gray-200">
                          <tr>
                            <td colSpan="3" className="px-4 py-3 text-base font-semibold text-gray-700 text-right">Total:</td>
                            <td className="px-4 py-3 text-base font-semibold text-green-600 text-right">{currencySymbol}{convertPrice(parseFloat(calculateTotalPrice())).toFixed(2)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Gift Message Preview */}
                    {boxCustomization.includingMessage && boxCustomization.message && (
                      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                        <h4 className="font-semibold mb-2">Gift Message:</h4>
                        <div className="bg-gray-50 p-3 rounded border border-gray-200 italic text-gray-700">
                          "{boxCustomization.message}"
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={goToPreviousStep}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-md font-medium transition duration-300"
                >
                  Back to Customization
                </button>

                <button
                  onClick={handleAddToCart}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition duration-300 flex items-center"
                >
                  <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateGiftBoxPage;
