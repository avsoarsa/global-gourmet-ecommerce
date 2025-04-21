import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoiceDollar, faBoxes, faTruck, faBuilding } from '@fortawesome/free-solid-svg-icons';

const ServicesSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 md:mb-24">
          <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full mb-3">OUR SERVICES</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Bulk Order Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">We offer a range of services designed to meet the unique needs of our wholesale customers.</p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <div className="space-y-8">
              <div className="flex bg-white p-6 rounded-xl shadow-md border border-gray-100 transform transition duration-500 hover:shadow-xl">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-green-600 text-xl" />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold mb-2">Volume Discounts</h3>
                  <p className="text-gray-600">
                    Significant savings on large quantity orders with our tiered pricing structure.
                    The more you order, the more you save.
                  </p>
                </div>
              </div>

              <div className="flex bg-white p-6 rounded-xl shadow-md border border-gray-100 transform transition duration-500 hover:shadow-xl">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faBoxes} className="text-green-600 text-xl" />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold mb-2">Custom Packaging</h3>
                  <p className="text-gray-600">
                    Tailored packaging solutions to meet your specific requirements, including private
                    labeling options for retailers and distributors.
                  </p>
                </div>
              </div>

              <div className="flex bg-white p-6 rounded-xl shadow-md border border-gray-100 transform transition duration-500 hover:shadow-xl">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faTruck} className="text-green-600 text-xl" />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold mb-2">Flexible Delivery</h3>
                  <p className="text-gray-600">
                    Schedule deliveries according to your business needs with our efficient logistics
                    network covering domestic and international destinations.
                  </p>
                </div>
              </div>

              <div className="flex bg-white p-6 rounded-xl shadow-md border border-gray-100 transform transition duration-500 hover:shadow-xl">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faBuilding} className="text-green-600 text-xl" />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold mb-2">Dedicated Account Manager</h3>
                  <p className="text-gray-600">
                    A personal point of contact to handle your orders, answer questions, and ensure
                    your complete satisfaction with our products and services.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1604719312566-8912e9c8a213?q=80&w=1000&auto=format&fit=crop"
                alt="Bulk order packaging"
                className="rounded-xl shadow-xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-green-600 text-white p-6 rounded-lg shadow-lg hidden md:block">
                <p className="font-bold text-xl">Premium Wholesale Service</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <a href="#quote-form" className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition duration-300 transform hover:scale-105">
            Request a Custom Quote
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
