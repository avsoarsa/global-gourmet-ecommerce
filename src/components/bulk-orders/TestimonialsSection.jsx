import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full mb-3">TESTIMONIALS</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Business Clients Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Don't just take our word for it. Here's what our business clients have to say about our wholesale services.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 relative transform transition duration-500 hover:scale-105 hover:shadow-xl">
            <div className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/4">
              <div className="bg-green-600 text-white text-4xl w-12 h-12 flex items-center justify-center rounded-full shadow-lg">"</div>
            </div>
            <div className="pt-4">
              <p className="text-gray-700 italic mb-6">
                "As a restaurant owner, I appreciate their consistent quality and reliable bulk delivery service for my kitchen needs.
                Their spices have elevated our dishes and customers notice the difference."
              </p>
              <div className="flex items-center">
                <img
                  src="https://randomuser.me/api/portraits/women/3.jpg"
                  alt="Elena Rodriguez"
                  className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-green-600"
                />
                <div>
                  <h4 className="text-lg font-semibold">Elena Rodriguez</h4>
                  <p className="text-gray-600 text-sm">Restaurant Owner</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 relative transform transition duration-500 hover:scale-105 hover:shadow-xl">
            <div className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/4">
              <div className="bg-green-600 text-white text-4xl w-12 h-12 flex items-center justify-center rounded-full shadow-lg">"</div>
            </div>
            <div className="pt-4">
              <p className="text-gray-700 italic mb-6">
                "The quality of almonds I received was exceptional. They're now my regular supplier for my health food store.
                My customers love the freshness and quality of all their products."
              </p>
              <div className="flex items-center">
                <img
                  src="https://randomuser.me/api/portraits/women/1.jpg"
                  alt="Sarah Johnson"
                  className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-green-600"
                />
                <div>
                  <h4 className="text-lg font-semibold">Sarah Johnson</h4>
                  <p className="text-gray-600 text-sm">Health Food Store Owner</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 relative transform transition duration-500 hover:scale-105 hover:shadow-xl">
            <div className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/4">
              <div className="bg-green-600 text-white text-4xl w-12 h-12 flex items-center justify-center rounded-full shadow-lg">"</div>
            </div>
            <div className="pt-4">
              <p className="text-gray-700 italic mb-6">
                "We've been ordering in bulk for our hotel chain for over two years now. The consistency in quality and service has been outstanding. Highly recommended for any business."
              </p>
              <div className="flex items-center">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Michael Chen"
                  className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-green-600"
                />
                <div>
                  <h4 className="text-lg font-semibold">Michael Chen</h4>
                  <p className="text-gray-600 text-sm">Hotel Procurement Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a href="#quote-form" className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition duration-300 transform hover:scale-105">
            <FontAwesomeIcon icon={faQuoteLeft} className="mr-2" />
            Join Our Satisfied Clients
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
