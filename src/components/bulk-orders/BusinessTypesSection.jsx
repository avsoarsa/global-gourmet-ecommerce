import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faBoxes, faGlobe, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';

const BusinessTypesSection = () => {
  return (
    <section id="business-types" className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-200/20 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-200/20 rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block bg-gradient-to-r from-green-600 to-green-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-3 shadow-sm">
            WHO WE SERVE
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
            Tailored for Your Business
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            We provide customized wholesale solutions for a wide range of businesses in the food industry.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100 group hover:border-green-200 transition-all duration-300 hover:shadow-xl">
            <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
              <FontAwesomeIcon icon={faBuilding} className="text-green-600 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold mb-3 group-hover:text-green-600 transition-colors duration-300">Restaurants & Cafes</h3>
            <p className="text-gray-600 mb-6">
              Premium ingredients for your culinary creations, delivered on schedule to maintain your inventory.
            </p>
            <a 
              href="#quote-form" 
              className="inline-block mt-auto py-2 px-6 bg-white border border-green-500 text-green-600 rounded-full hover:bg-green-50 transition-colors duration-300 font-medium text-sm"
            >
              Get a Quote
            </a>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100 group hover:border-green-200 transition-all duration-300 hover:shadow-xl">
            <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
              <FontAwesomeIcon icon={faBuilding} className="text-green-600 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold mb-3 group-hover:text-green-600 transition-colors duration-300">Hotels & Resorts</h3>
            <p className="text-gray-600 mb-6">
              High-quality products for your food service operations and guest amenities with consistent quality.
            </p>
            <a 
              href="#quote-form" 
              className="inline-block mt-auto py-2 px-6 bg-white border border-green-500 text-green-600 rounded-full hover:bg-green-50 transition-colors duration-300 font-medium text-sm"
            >
              Get a Quote
            </a>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100 group hover:border-green-200 transition-all duration-300 hover:shadow-xl">
            <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
              <FontAwesomeIcon icon={faBoxes} className="text-green-600 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold mb-3 group-hover:text-green-600 transition-colors duration-300">Retailers</h3>
            <p className="text-gray-600 mb-6">
              Wholesale supply for health food stores, specialty shops, and grocery chains with flexible ordering.
            </p>
            <a 
              href="#quote-form" 
              className="inline-block mt-auto py-2 px-6 bg-white border border-green-500 text-green-600 rounded-full hover:bg-green-50 transition-colors duration-300 font-medium text-sm"
            >
              Get a Quote
            </a>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100 group hover:border-green-200 transition-all duration-300 hover:shadow-xl">
            <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
              <FontAwesomeIcon icon={faGlobe} className="text-green-600 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold mb-3 group-hover:text-green-600 transition-colors duration-300">Distributors</h3>
            <p className="text-gray-600 mb-6">
              Reliable supply chain partner for regional and international distribution networks with volume pricing.
            </p>
            <a 
              href="#quote-form" 
              className="inline-block mt-auto py-2 px-6 bg-white border border-green-500 text-green-600 rounded-full hover:bg-green-50 transition-colors duration-300 font-medium text-sm"
            >
              Get a Quote
            </a>
          </div>
        </div>
        
        <div className="mt-20 p-8 bg-white rounded-xl shadow-lg border border-gray-100 max-w-3xl mx-auto relative overflow-hidden group hover:border-green-200 transition-all duration-300 hover:shadow-xl">
          <div className="absolute top-0 right-0 w-40 h-40 bg-green-100 rounded-full -translate-y-1/2 translate-x-1/4 group-hover:bg-green-200 transition-colors duration-500"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="md:w-1/4 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
                <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-green-600 text-4xl" />
              </div>
            </div>
            <div className="md:w-3/4">
              <h3 className="text-2xl font-semibold mb-3 group-hover:text-green-600 transition-colors duration-300">Custom Business Solutions</h3>
              <p className="text-gray-600 mb-4">
                Don't see your business type? We offer customized wholesale solutions for various industries. 
                Contact us to discuss your specific requirements.
              </p>
              <a 
                href="#quote-form" 
                className="inline-flex items-center text-green-600 hover:text-green-700 font-medium group"
              >
                Contact our team
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessTypesSection;
