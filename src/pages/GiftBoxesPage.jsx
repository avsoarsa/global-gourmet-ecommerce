import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift, faBoxOpen, faBuilding } from '@fortawesome/free-solid-svg-icons';
import GiftBoxCard from '../components/common/GiftBoxCard';
import { giftBoxes } from '../data/products';

const GiftBoxesPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
        <div
          className="absolute inset-0 bg-cover bg-center transform hover:scale-105 transition-transform duration-3000 ease-in-out"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1607897441350-dc0d9c061a6f?q=80&w=1000&auto=format&fit=crop')",
            backgroundBlendMode: "overlay"
          }}
        ></div>

        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-block bg-green-600 text-white text-sm font-semibold px-3 py-1 rounded-full mb-4 animate-pulse">PREMIUM SELECTION</span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">Exquisite Gift Boxes</h1>
            <p className="text-xl mb-8 text-gray-200 max-w-xl">
              Thoughtfully curated gift boxes featuring our finest products. Perfect for special occasions,
              corporate gifting, or treating yourself to a premium selection.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#gift-boxes"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md font-medium transition duration-300 transform hover:scale-105 inline-flex items-center"
              >
                <FontAwesomeIcon icon={faGift} className="mr-2" />
                Explore Gift Boxes
              </a>
              <Link
                to="/create-gift-box"
                className="bg-transparent hover:bg-white/10 text-white border-2 border-white px-8 py-3 rounded-md font-medium transition duration-300 transform hover:scale-105"
              >
                Create Your Own
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-designed Gift Boxes */}
      <section id="gift-boxes" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full mb-3">HANDCRAFTED WITH CARE</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Signature Gift Boxes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Each gift box is thoughtfully curated with premium products and elegantly packaged to create a memorable gifting experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {giftBoxes.map((giftBox, index) => (
              <div
                key={giftBox.id}
                className="transform transition duration-500 hover:scale-105 hover:shadow-xl"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <GiftBoxCard giftBox={giftBox} />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">Looking for something specific? We can create custom gift boxes tailored to your preferences.</p>
            <Link
              to="/contact"
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
            >
              <FontAwesomeIcon icon={faBoxOpen} className="mr-2" />
              Contact us for custom orders
            </Link>
          </div>
        </div>
      </section>

      {/* Create Your Own */}
      <section id="create-own" className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Create Your Own Gift Box</h2>
            <p className="text-gray-700 mb-0 max-w-2xl mx-auto">
              Design a personalized gift box with your favorite products.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
            {/* Left Column - Image */}
            <div className="md:w-2/5">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=1000&auto=format&fit=crop"
                  alt="Custom gift box"
                  className="rounded-lg shadow-lg w-full"
                />
                <div className="absolute -bottom-4 -right-4 bg-green-600 text-white p-4 rounded-lg shadow-md">
                  <p className="font-bold">100% Customizable</p>
                </div>
              </div>
            </div>

            {/* Right Column - Steps */}
            <div className="md:w-3/5">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">How It Works</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <div className="bg-green-600 w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Select Your Products</h3>
                      <p className="text-gray-600 text-sm">Choose from our premium dry fruits, nuts, and spices</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-green-600 w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Choose Packaging</h3>
                      <p className="text-gray-600 text-sm">Select your preferred box size and color</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-green-600 w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Add Personal Message</h3>
                      <p className="text-gray-600 text-sm">Include a heartfelt message with your gift</p>
                    </div>
                  </div>
                </div>

                <Link
                  to="/create-gift-box"
                  className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium transition duration-300"
                >
                  <FontAwesomeIcon icon={faGift} className="mr-2" />
                  Start Creating Your Box
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gifting Occasions */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full mb-3">FOR EVERY MOMENT</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Perfect for Every Occasion</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our gift boxes are designed to make any occasion special, from corporate events to personal celebrations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center transform transition duration-500 hover:scale-105 hover:shadow-xl border border-gray-100">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faBuilding} className="text-green-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Corporate Gifting</h3>
              <p className="text-gray-600">
                Impress clients and employees with premium gift hampers that reflect your company's values.
              </p>
              <Link to="/corporate-gifting" className="inline-block mt-4 text-green-600 hover:text-green-700 font-medium">
                Learn More
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center transform transition duration-500 hover:scale-105 hover:shadow-xl border border-gray-100">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faGift} className="text-green-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Holidays & Festivals</h3>
              <p className="text-gray-600">
                Celebrate special occasions with thoughtfully curated gift boxes for friends and family.
              </p>
              <Link to="/holiday-gifts" className="inline-block mt-4 text-green-600 hover:text-green-700 font-medium">
                Learn More
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center transform transition duration-500 hover:scale-105 hover:shadow-xl border border-gray-100">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faBoxOpen} className="text-green-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Wellness Gifts</h3>
              <p className="text-gray-600">
                Show you care with health-focused gift packages featuring organic superfoods and nutritious treats.
              </p>
              <Link to="/wellness-gifts" className="inline-block mt-4 text-green-600 hover:text-green-700 font-medium">
                Learn More
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center transform transition duration-500 hover:scale-105 hover:shadow-xl border border-gray-100">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faGift} className="text-green-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Personal Indulgence</h3>
              <p className="text-gray-600">
                Treat yourself to a premium selection of gourmet products for your own enjoyment.
              </p>
              <Link to="/personal-gifts" className="inline-block mt-4 text-green-600 hover:text-green-700 font-medium">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full mb-3">TESTIMONIALS</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Gift Recipients Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Don't just take our word for it. Here's what our customers have to say about our gift boxes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 relative">
              <div className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/4">
                <div className="bg-green-600 text-white text-4xl w-12 h-12 flex items-center justify-center rounded-full shadow-lg">"</div>
              </div>
              <p className="text-gray-700 italic mb-6 pt-4">
                The corporate gift hampers were a hit with our clients. The packaging was elegant and the
                products were of premium quality. We've received numerous compliments.
              </p>
              <div className="flex items-center">
                <img
                  src="https://randomuser.me/api/portraits/men/2.jpg"
                  alt="Michael Chen"
                  className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-green-600"
                />
                <div>
                  <h4 className="font-semibold">Michael Chen</h4>
                  <p className="text-gray-600 text-sm">Corporate Client</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 relative">
              <div className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/4">
                <div className="bg-green-600 text-white text-4xl w-12 h-12 flex items-center justify-center rounded-full shadow-lg">"</div>
              </div>
              <p className="text-gray-700 italic mb-6 pt-4">
                I ordered a wellness gift box for my sister's birthday and she absolutely loved it! The quality of the products was exceptional and the presentation was beautiful.
              </p>
              <div className="flex items-center">
                <img
                  src="https://randomuser.me/api/portraits/women/3.jpg"
                  alt="Sarah Johnson"
                  className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-green-600"
                />
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-gray-600 text-sm">Satisfied Customer</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 relative">
              <div className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/4">
                <div className="bg-green-600 text-white text-4xl w-12 h-12 flex items-center justify-center rounded-full shadow-lg">"</div>
              </div>
              <p className="text-gray-700 italic mb-6 pt-4">
                The custom gift box service was fantastic. I was able to select exactly what I wanted, and the team was very helpful throughout the process. Will definitely order again!
              </p>
              <div className="flex items-center">
                <img
                  src="https://randomuser.me/api/portraits/women/1.jpg"
                  alt="Emily Rodriguez"
                  className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-green-600"
                />
                <div>
                  <h4 className="font-semibold">Emily Rodriguez</h4>
                  <p className="text-gray-600 text-sm">Repeat Customer</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/testimonials" className="inline-flex items-center text-green-600 hover:text-green-700 font-medium">
              Read more testimonials
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>


    </div>
  );
};

export default GiftBoxesPage;
