import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneAlt } from '@fortawesome/free-solid-svg-icons';

const AssistanceCard = () => {
  return (
    <div className="mt-12 bg-gradient-to-r from-green-50 to-white rounded-xl shadow-lg p-8 border border-green-100 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -translate-y-1/2 translate-x-1/4 opacity-70 group-hover:bg-green-200 transition-all duration-500"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-100 rounded-full translate-y-1/2 -translate-x-1/4 opacity-70 group-hover:bg-green-200 transition-all duration-500"></div>
      
      <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
        <div className="md:w-1/4 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
            <FontAwesomeIcon icon={faPhoneAlt} className="text-white text-2xl" />
          </div>
        </div>
        <div className="md:w-3/4 text-center md:text-left">
          <h3 className="text-2xl font-semibold mb-3 group-hover:text-green-600 transition-colors duration-300">Need Immediate Assistance?</h3>
          <p className="text-gray-600 mb-4 text-lg">
            Our wholesale team is available Monday through Friday, 9am to 5pm EST.
            Call us directly at <a href="tel:+1234567890" className="text-green-600 font-semibold hover:text-green-700 transition-colors duration-300">+1 (234) 567-890</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssistanceCard;
