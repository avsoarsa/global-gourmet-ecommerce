import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTag, faTruck } from '@fortawesome/free-solid-svg-icons';

const BenefitsSection = () => {
  return (
    <section id="benefits" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -z-10"></div>
          <span className="inline-block bg-gradient-to-r from-green-600 to-green-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-3 shadow-sm">
            WHY CHOOSE US
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
            Wholesale Excellence
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            We provide premium quality products, competitive pricing, and reliable service to meet your business needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="group relative">
            <div className="absolute inset-0.5 bg-gradient-to-tr from-green-300 to-green-600 opacity-0 group-hover:opacity-100 rounded-2xl blur transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white rounded-xl shadow-lg p-8 text-center transition duration-500 group-hover:shadow-xl border border-gray-100 h-full flex flex-col">
              <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-3xl" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Premium Quality</h3>
              <p className="text-gray-600 flex-grow">
                All our products are sourced directly from the finest farms and orchards around the world, 
                ensuring consistent premium quality for your business needs.
              </p>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <span className="text-green-600 font-medium inline-flex items-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-sm" />
                  100% Quality Guarantee
                </span>
              </div>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute inset-0.5 bg-gradient-to-tr from-green-300 to-green-600 opacity-0 group-hover:opacity-100 rounded-2xl blur transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white rounded-xl shadow-lg p-8 text-center transition duration-500 group-hover:shadow-xl border border-gray-100 h-full flex flex-col">
              <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                <FontAwesomeIcon icon={faTag} className="text-green-600 text-3xl" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Competitive Pricing</h3>
              <p className="text-gray-600 flex-grow">
                Our direct relationships with producers allow us to offer competitive wholesale pricing 
                with volume-based discounts that grow with your business.
              </p>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <span className="text-green-600 font-medium inline-flex items-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-sm" />
                  Volume Discounts Available
                </span>
              </div>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute inset-0.5 bg-gradient-to-tr from-green-300 to-green-600 opacity-0 group-hover:opacity-100 rounded-2xl blur transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white rounded-xl shadow-lg p-8 text-center transition duration-500 group-hover:shadow-xl border border-gray-100 h-full flex flex-col">
              <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                <FontAwesomeIcon icon={faTruck} className="text-green-600 text-3xl" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Reliable Delivery</h3>
              <p className="text-gray-600 flex-grow">
                Scheduled deliveries according to your business needs with our efficient logistics network 
                covering domestic and international destinations.
              </p>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <span className="text-green-600 font-medium inline-flex items-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-sm" />
                  On-time Delivery Promise
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <a 
            href="#business-types" 
            className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-md hover:shadow-lg transition duration-300 text-green-600 hover:text-green-700 font-medium group"
          >
            See who we serve
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-y-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
