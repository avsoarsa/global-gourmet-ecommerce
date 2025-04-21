import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar, faGift, faShoppingBag, faCalendarAlt,
  faArrowUp, faArrowDown, faInfoCircle, faExchangeAlt
} from '@fortawesome/free-solid-svg-icons';
import { useLoyalty } from '../../context/LoyaltyContext';

// Using loyalty tiers and rewards from LoyaltyContext

// Points Summary Component
const PointsSummary = ({ points, pointsToNextTier, currentTier, nextTier }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {t('account.pointsAvailable')}
            </h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-green-600">{points}</span>
              <span className="ml-2 text-sm text-gray-500">{t('account.points')}</span>
            </div>
          </div>

          <div className={`mt-4 md:mt-0 px-4 py-2 rounded-full ${currentTier.bgColor}`}>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faStar} className={`mr-2 ${currentTier.color}`} />
              <span className={`font-medium ${currentTier.color}`}>
                {currentTier.name} {t('account.member')}
              </span>
            </div>
          </div>
        </div>

        {nextTier && (
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>{currentTier.name}</span>
              <span>{nextTier.name}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full"
                style={{ width: `${Math.min(100, (points / nextTier.minPoints) * 100)}%` }}
              ></div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {t('account.pointsToNextTier', { points: pointsToNextTier, tier: nextTier.name })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Points History Component
const PointsHistory = ({ history }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">
          {t('account.pointsHistory')}
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {history.length > 0 ? (
          history.map((item) => (
            <div key={item.id} className="px-6 py-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className={`p-2 rounded-full ${
                    item.type === 'earned' ? 'bg-green-100' : 'bg-red-100'
                  } mr-4`}>
                    <FontAwesomeIcon
                      icon={item.type === 'earned' ? faArrowUp : faArrowDown}
                      className={item.type === 'earned' ? 'text-green-600' : 'text-red-600'}
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{item.description}</div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-gray-400" />
                      {item.date}
                    </div>
                  </div>
                </div>
                <div className={`font-medium ${
                  item.type === 'earned' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.type === 'earned' ? '+' : '-'}{item.points} {t('account.points')}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-8 text-center">
            <FontAwesomeIcon icon={faInfoCircle} className="text-gray-400 text-4xl mb-4" />
            <p className="text-gray-500">{t('account.noPointsHistory')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Available Rewards Component
const AvailableRewards = ({ rewards, points, onRedeem }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">
          {t('account.availableRewards')}
        </h3>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards.map((reward) => (
            <div key={reward.id} className="border rounded-lg overflow-hidden">
              <div className="h-32 bg-gray-200">
                <img
                  src={reward.image}
                  alt={reward.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h4 className="font-medium text-gray-900">{reward.name}</h4>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center text-gray-500">
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-yellow-500" />
                    <span>{reward.points} {t('account.points')}</span>
                  </div>
                  <button
                    onClick={() => onRedeem(reward)}
                    disabled={points < reward.points}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      points >= reward.points
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {t('account.redeem')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// How to Earn Points Component
const HowToEarnPoints = () => {
  const { t } = useTranslation();

  const earnMethods = [
    {
      icon: faShoppingBag,
      title: t('account.earnByPurchase'),
      description: t('account.earnByPurchaseDesc'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: faStar,
      title: t('account.earnByReview'),
      description: t('account.earnByReviewDesc'),
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      icon: faGift,
      title: t('account.earnByReferral'),
      description: t('account.earnByReferralDesc'),
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">
          {t('account.howToEarn')}
        </h3>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {earnMethods.map((method, index) => (
            <div key={index} className="text-center">
              <div className={`w-12 h-12 mx-auto rounded-full ${method.bgColor} flex items-center justify-center`}>
                <FontAwesomeIcon icon={method.icon} className={`${method.color}`} />
              </div>
              <h4 className="mt-4 font-medium text-gray-900">{method.title}</h4>
              <p className="mt-2 text-sm text-gray-500">{method.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main LoyaltyPoints Component
const LoyaltyPoints = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);

  // Get loyalty data from context
  const {
    points,
    tier: currentTier,
    history: pointsHistory,
    getNextTier,
    getPointsToNextTier,
    redeemReward,
    availableRewards,
    isRewardAvailable
  } = useLoyalty();

  // Determine next tier
  const nextTier = getNextTier();
  const pointsToNextTier = getPointsToNextTier();

  const handleRedeem = (reward) => {
    if (!isRewardAvailable(reward)) {
      return; // Not enough points
    }
    setSelectedReward(reward);
    setShowRedeemModal(true);
  };

  const confirmRedeem = async () => {
    const success = await redeemReward(selectedReward);
    if (success) {
      setShowRedeemModal(false);
      setSelectedReward(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('account.loyaltyPoints')}
        </h2>
        <p className="text-gray-600 mt-1">
          {t('account.loyaltyPointsDesc')}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-4 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('account.overview')}
            </button>
            <button
              onClick={() => setActiveTab('rewards')}
              className={`px-4 py-4 text-sm font-medium ${
                activeTab === 'rewards'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('account.rewards')}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-4 text-sm font-medium ${
                activeTab === 'history'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('account.history')}
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          <PointsSummary
            points={points}
            pointsToNextTier={pointsToNextTier}
            currentTier={currentTier}
            nextTier={nextTier}
          />
          <HowToEarnPoints />
        </>
      )}

      {activeTab === 'rewards' && (
        <AvailableRewards
          rewards={availableRewards}
          points={points}
          onRedeem={handleRedeem}
        />
      )}

      {activeTab === 'history' && (
        <PointsHistory history={pointsHistory} />
      )}

      {/* Redeem Confirmation Modal */}
      {showRedeemModal && selectedReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {t('account.confirmRedeem')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('account.confirmRedeemDesc', {
                reward: selectedReward.name,
                points: selectedReward.points
              })}
            </p>
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-md mb-6">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faExchangeAlt} className="text-green-600 mr-3" />
                <div>
                  <div className="text-sm text-gray-500">{t('account.currentBalance')}</div>
                  <div className="font-medium text-gray-900">{points} {t('account.points')}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">{t('account.newBalance')}</div>
                <div className="font-medium text-gray-900">{points - selectedReward.points} {t('account.points')}</div>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowRedeemModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={confirmRedeem}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                {t('account.confirmRedeem')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoyaltyPoints;
