import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import LazyImage from './LazyImage';

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
          <LazyImage
            src={testimonial.image}
            alt={testimonial.name}
            className="w-full h-full"
            type="user"
          />
        </div>
        <div>
          <h4 className="text-lg font-semibold">{testimonial.name}</h4>
          <p className="text-gray-600">{testimonial.role}</p>
        </div>
      </div>

      <div className="relative">
        <FontAwesomeIcon
          icon={faQuoteLeft}
          className="text-green-100 text-4xl absolute -top-2 -left-1"
        />
        <p className="text-gray-700 italic relative z-10 pl-6">
          "{testimonial.text}"
        </p>
      </div>
    </div>
  );
};

export default TestimonialCard;
