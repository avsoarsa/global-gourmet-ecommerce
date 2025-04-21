import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const SuccessMessage = () => {
  return (
    <div className="bg-white rounded-xl shadow-xl p-10 border border-gray-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-green-100 rounded-full -translate-y-1/2 translate-x-1/4"></div>
      <div className="flex items-center justify-center flex-col text-center relative z-10">
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-8 shadow-lg">
          <FontAwesomeIcon icon={faCheckCircle} className="text-white text-4xl" />
        </div>
        <h3 className="text-3xl font-bold text-gray-800 mb-4">Thank you for your inquiry!</h3>
        <p className="text-gray-600 max-w-lg text-lg">
          We've received your request and a member of our team will contact you within 24 hours to discuss your bulk order requirements.
        </p>
        <a
          href="/products"
          className="mt-10 inline-flex items-center px-6 py-3 bg-white border border-green-500 rounded-full text-green-600 hover:bg-green-50 transition-colors duration-300 font-medium shadow-sm hover:shadow-md"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back to Products
        </a>
      </div>
    </div>
  );
};

export default SuccessMessage;
