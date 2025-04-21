import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import ProductCard from '../components/common/ProductCard';
import CategoryCard from '../components/common/CategoryCard';
import GiftBoxCard from '../components/common/GiftBoxCard';
import TestimonialCard from '../components/common/TestimonialCard';
import { products, categories, giftBoxes, testimonials } from '../data/products';

const HomePage = () => {
  // Filter featured products
  const featuredProducts = products.filter(product => product.featured);

  // Filter dry fruits products
  const dryFruitsProducts = products.filter(product => product.category === 'Dry Fruits').slice(0, 3);

  // Filter dried fruits products
  const driedFruitsProducts = products.filter(product => product.category === 'Dried Fruits').slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop')",
            backgroundBlendMode: "overlay"
          }}
        ></div>

        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Premium Quality Dry Fruits & Spices</h1>
            <p className="text-xl mb-8">
              Sourced from the finest orchards and farms across the globe. 100% natural, organic, and packed with nutrients.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition duration-300"
              >
                Shop Now
              </Link>
              <Link
                to="/about"
                className="bg-transparent border border-white hover:bg-white hover:text-gray-900 text-white px-6 py-3 rounded-md font-medium transition duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Premium Categories</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/products"
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
            >
              View All Products
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Our Featured Products</h2>
          <p className="text-center text-gray-600 mb-12">Premium selections from our finest collection</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/products"
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
            >
              View All Featured Products
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Dry Fruits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Explore Our Dry Fruits</h2>
          <p className="text-center text-gray-600 mb-12">Premium quality dry fruits sourced from the finest orchards</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {driedFruitsProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/category/dry-fruits"
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
            >
              View All Dry Fruits
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Dried Fruits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Discover Our Dried Fruits</h2>
          <p className="text-center text-gray-600 mb-12">Naturally sweet dried fruits with no added sugar</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {driedFruitsProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/category/dried-fruits"
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
            >
              View All Dried Fruits
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Gift Boxes Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Premium Gift Boxes</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {giftBoxes.map(giftBox => (
              <GiftBoxCard key={giftBox.id} giftBox={giftBox} />
            ))}
          </div>
        </div>
      </section>

      {/* Bulk Orders Section */}
      <section className="py-16 bg-green-700 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <h2 className="text-3xl font-bold mb-4">Bulk Orders for Businesses</h2>
              <h3 className="text-xl font-semibold mb-6">Wholesale Pricing for Businesses</h3>
              <p className="mb-6">
                We offer competitive wholesale pricing for restaurants, hotels, retailers, and other businesses.
                Our bulk orders come with customized packaging options and flexible delivery schedules.
              </p>

              <ul className="space-y-2 mb-8">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                  Minimum order: 10kg per product
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                  Custom packaging available
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                  Dedicated account manager
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                  Global shipping available
                </li>
              </ul>

              <Link
                to="/bulk-orders"
                className="inline-block bg-white text-green-700 hover:bg-gray-100 px-6 py-3 rounded-md font-medium transition duration-300"
              >
                Request Quote
              </Link>
            </div>

            <div className="lg:w-1/2 lg:pl-12">
              <img
                src="https://images.unsplash.com/photo-1604719312566-8912e9c8a213?q=80&w=1000&auto=format&fit=crop"
                alt="Bulk order packaging"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-green-800 bg-opacity-50 p-6 rounded-lg">
              <h4 className="text-xl font-semibold mb-3">Volume Discounts</h4>
              <p>Significant savings on large quantity orders with tiered pricing structure.</p>
            </div>

            <div className="bg-green-800 bg-opacity-50 p-6 rounded-lg">
              <h4 className="text-xl font-semibold mb-3">Flexible Delivery</h4>
              <p>Schedule deliveries according to your business needs with our logistics network.</p>
            </div>

            <div className="bg-green-800 bg-opacity-50 p-6 rounded-lg">
              <h4 className="text-xl font-semibold mb-3">Private Labeling</h4>
              <p>Custom branding options available for retailers and distributors.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(testimonial => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-700 mb-8">
              Founded in 2010, Global Gourmet has grown from a small family business to an internationally
              recognized supplier of premium dry fruits, spices, and whole foods.
            </p>
            <p className="text-gray-700 mb-10">
              We work directly with farmers and producers across the globe to bring you the finest quality
              products while ensuring fair trade practices and sustainable sourcing.
            </p>

            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">13+</div>
                <div className="text-gray-600">Years in Business</div>
              </div>

              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
                <div className="text-gray-600">Countries Served</div>
              </div>

              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">1000+</div>
                <div className="text-gray-600">Happy Clients</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
