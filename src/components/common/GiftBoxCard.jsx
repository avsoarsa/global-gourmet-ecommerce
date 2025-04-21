import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift } from '@fortawesome/free-solid-svg-icons';
import { useRegion } from '../../context/RegionContext';

const GiftBoxCard = ({ giftBox }) => {
  const { convertPriceSync, currencySymbol } = useRegion();
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 overflow-hidden relative">
        <img
          src={giftBox.image}
          alt={giftBox.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 bg-green-600 text-white px-3 py-1 m-2 rounded-full text-sm font-medium">
          <FontAwesomeIcon icon={faGift} className="mr-1" />
          Gift Box
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{giftBox.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{giftBox.description}</p>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Includes:</h4>
          <ul className="text-sm text-gray-600 pl-4 list-disc">
            {giftBox.contents.slice(0, 3).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
            {giftBox.contents.length > 3 && (
              <li>+{giftBox.contents.length - 3} more items</li>
            )}
          </ul>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-green-700">
            {currencySymbol}
            {(() => {
              const price = convertPriceSync(giftBox.price);
              return typeof price === 'number' ? price.toFixed(2) : '0.00';
            })()}
          </span>

          <Link
            to={`/create-gift-box?boxId=${giftBox.id}`}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
          >
            Customize
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GiftBoxCard;
