import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt, faCreditCard, faPause, faPlay,
  faEdit, faTimes, faInfoCircle, faPlus
} from '@fortawesome/free-solid-svg-icons';
import { useRegion } from '../../context/RegionContext';
import { useSubscription } from '../../context/SubscriptionContext';

// Subscription Card Component
const SubscriptionCard = ({ subscription, onPauseResume, onEdit, onCancel }) => {
  const { t } = useTranslation();
  const { formatPrice } = useRegion();
  const { SUBSCRIPTION_STATUS } = useSubscription();

  const getStatusColor = (status) => {
    switch (status) {
      case SUBSCRIPTION_STATUS.ACTIVE:
        return 'bg-green-100 text-green-800';
      case SUBSCRIPTION_STATUS.PAUSED:
        return 'bg-yellow-100 text-yellow-800';
      case SUBSCRIPTION_STATUS.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFrequencyText = (frequency) => {
    return t(`subscription.${frequency}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{subscription.name}</h3>
            <div className="mt-1 text-sm text-gray-500">
              {subscription.description}
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
            {t(`account.status.${subscription.status}`)}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-xs font-medium text-gray-500 mb-1">
              {t('account.nextDelivery')}
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-900">
                {subscription.nextDelivery}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-xs font-medium text-gray-500 mb-1">
              {t('account.frequency')}
            </div>
            <div className="text-sm font-medium text-gray-900">
              {getFrequencyText(subscription.frequency)}
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-xs font-medium text-gray-500 mb-1">
              {t('account.price')}
            </div>
            <div className="text-sm font-medium text-gray-900">
              {formatPrice(subscription.price)}
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="flex flex-wrap gap-2">
            {subscription.status !== STATUSES.CANCELLED && (
              <>
                <button
                  onClick={() => onEdit(subscription)}
                  className="btn-outline-sm"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2" />
                  {t('account.edit')}
                </button>

                <button
                  onClick={() => onPauseResume(subscription)}
                  className={`btn-outline-sm ${
                    subscription.status === STATUSES.PAUSED ? 'text-green-600' : 'text-yellow-600'
                  }`}
                >
                  <FontAwesomeIcon
                    icon={subscription.status === STATUSES.PAUSED ? faPlay : faPause}
                    className="mr-2"
                  />
                  {subscription.status === STATUSES.PAUSED
                    ? t('account.resume')
                    : t('account.pause')
                  }
                </button>

                <button
                  onClick={() => onCancel(subscription)}
                  className="btn-outline-sm text-red-600"
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-2" />
                  {t('account.cancel')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Edit Subscription Modal
const EditSubscriptionModal = ({ subscription, onSave, onCancel }) => {
  const { t } = useTranslation();
  const { SUBSCRIPTION_FREQUENCIES } = useSubscription();
  const [frequency, setFrequency] = useState(subscription.frequency);
  const [quantity, setQuantity] = useState(subscription.quantity);

  const handleSave = () => {
    onSave({
      ...subscription,
      frequency,
      quantity
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {t('subscription.editSubscription')}
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('subscription.frequency')}
          </label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="form-select w-full"
          >
            {SUBSCRIPTION_FREQUENCIES.map(freq => (
              <option key={freq.id} value={freq.id}>
                {freq.name} - {freq.description}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('products.quantity')}
          </label>
          <div className="flex items-center">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1 border border-gray-300 rounded-l-md"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="form-input border-l-0 border-r-0 rounded-none w-16 text-center"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-1 border border-gray-300 rounded-r-md"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
};

// Cancel Subscription Modal
const CancelSubscriptionModal = ({ subscription, onConfirm, onCancel }) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {t('account.cancelSubscription')}
        </h3>

        <p className="text-gray-600 mb-4">
          {t('account.cancelSubscriptionConfirm')}
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('account.cancelReason')} ({t('common.optional')})
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="form-select w-full"
          >
            <option value="">{t('account.selectReason')}</option>
            <option value="too_expensive">{t('account.reasonTooExpensive')}</option>
            <option value="not_using">{t('account.reasonNotUsing')}</option>
            <option value="quality_issues">{t('account.reasonQualityIssues')}</option>
            <option value="switching">{t('account.reasonSwitching')}</option>
            <option value="other">{t('account.reasonOther')}</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={() => onConfirm(subscription, reason)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            {t('account.confirmCancel')}
          </button>
        </div>
      </div>
    </div>
  );
};

// Create Subscription Modal
const CreateSubscriptionModal = ({ products, onSave, onCancel }) => {
  const { t } = useTranslation();
  const { formatPrice } = useRegion();
  const { SUBSCRIPTION_FREQUENCIES, SUBSCRIPTION_STATUS } = useSubscription();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [frequency, setFrequency] = useState('monthly');
  const [quantity, setQuantity] = useState(1);

  const handleSave = () => {
    if (!selectedProduct) return;

    // Calculate next delivery date based on frequency
    const selectedFrequency = SUBSCRIPTION_FREQUENCIES.find(f => f.id === frequency);
    const nextDeliveryDate = new Date();
    nextDeliveryDate.setDate(nextDeliveryDate.getDate() + selectedFrequency.days);

    onSave({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      description: selectedProduct.description,
      image: selectedProduct.image,
      price: selectedProduct.price * quantity,
      frequency,
      quantity,
      status: SUBSCRIPTION_STATUS.ACTIVE,
      nextDeliveryDate: nextDeliveryDate.toISOString()
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {t('account.createSubscription')}
        </h3>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('account.selectProduct')}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className={`border rounded-md p-3 cursor-pointer ${
                  selectedProduct?.id === product.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <div className="h-12 w-12 flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">{formatPrice(product.price)}</div>
                  </div>
                  {selectedProduct?.id === product.id && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('account.frequency')}
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="form-select w-full"
            >
              {SUBSCRIPTION_FREQUENCIES.map(freq => (
                <option key={freq.id} value={freq.id}>
                  {freq.name} - {freq.description} ({freq.discount}% {t('product.off')})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('products.quantity')}
            </label>
            <div className="flex items-center">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 border border-gray-300 rounded-l-md"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="form-input border-l-0 border-r-0 rounded-none w-16 text-center"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 border border-gray-300 rounded-r-md"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {selectedProduct && (
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {t('account.subscriptionSummary')}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {quantity} x {selectedProduct.name} ({t(`account.${frequency}`)})
                </div>
              </div>
              <div className="text-lg font-bold text-gray-900">
                {formatPrice(selectedProduct.price * quantity)}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedProduct}
            className={`px-4 py-2 rounded-md ${
              selectedProduct
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {t('common.create')}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Subscriptions Component
const Subscriptions = () => {
  const { t } = useTranslation();
  const {
    subscriptions,
    loading,
    pauseUserSubscription,
    resumeUserSubscription,
    cancelUserSubscription,
    updateUserSubscription,
    SUBSCRIPTION_STATUS,
    SUBSCRIPTION_FREQUENCIES
  } = useSubscription();

  // Sample products for creating new subscriptions
  const [products] = useState([
    {
      id: 1,
      name: 'Monthly Nut Mix',
      description: 'Assorted premium nuts',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2b?w=320&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      id: 2,
      name: 'Organic Almonds',
      description: 'Premium organic almonds',
      price: 19.99,
      image: 'https://images.unsplash.com/photo-1574570068036-e97e8c8c24a1?w=320&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      id: 3,
      name: 'Cashew Nuts',
      description: 'Premium cashew nuts',
      price: 22.99,
      image: 'https://images.unsplash.com/photo-1563412885-a1e904cf631c?w=320&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      id: 4,
      name: 'Organic Walnuts',
      description: 'Premium organic walnuts',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1563412887-471f435df07d?w=320&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      id: 5,
      name: 'Dried Fruit Box',
      description: 'Selection of premium dried fruits',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1596591868231-05e882e38a8f?w=320&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    }
  ]);

  const [editingSubscription, setEditingSubscription] = useState(null);
  const [cancellingSubscription, setCancellingSubscription] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const handlePauseResume = (subscription) => {
    if (subscription.status === SUBSCRIPTION_STATUS.PAUSED) {
      resumeUserSubscription(subscription.id);
    } else {
      pauseUserSubscription(subscription.id);
    }
  };

  const handleEdit = (subscription) => {
    setEditingSubscription(subscription);
  };

  const handleSaveEdit = (updatedSubscription) => {
    updateUserSubscription(updatedSubscription.id, {
      frequency: updatedSubscription.frequency,
      quantity: updatedSubscription.quantity
    });
    setEditingSubscription(null);
  };

  const handleCancel = (subscription) => {
    setCancellingSubscription(subscription);
  };

  const handleConfirmCancel = (subscription, reason) => {
    cancelUserSubscription(subscription.id, { cancelReason: reason });
    setCancellingSubscription(null);
  };

  const handleCreateSubscription = () => {
    setIsCreating(true);
  };

  const handleSaveNewSubscription = (newSubscription) => {
    // In a real implementation, this would call the subscribeToProduct function
    // from the SubscriptionContext
    setIsCreating(false);
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const activeSubscriptions = subscriptions.filter(sub => sub.status !== SUBSCRIPTION_STATUS.CANCELLED);
  const cancelledSubscriptions = subscriptions.filter(sub => sub.status === SUBSCRIPTION_STATUS.CANCELLED);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t('subscription.mySubscriptions')}
          </h2>
          <p className="text-gray-600 mt-1">
            {t('subscription.manageSubscriptionsDesc')}
          </p>
        </div>

        <button
          onClick={handleCreateSubscription}
          className="btn-primary"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          {t('subscription.newSubscription')}
        </button>
      </div>

      {activeSubscriptions.length === 0 && cancelledSubscriptions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FontAwesomeIcon icon={faInfoCircle} className="text-gray-400 text-4xl mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('subscription.noSubscriptions')}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('subscription.noSubscriptionsDesc')}
          </p>
          <button
            onClick={handleCreateSubscription}
            className="btn-primary"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            {t('subscription.startSubscription')}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {activeSubscriptions.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('subscription.activeSubscriptions')}
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {activeSubscriptions.map(subscription => (
                  <SubscriptionCard
                    key={subscription.id}
                    subscription={subscription}
                    onPauseResume={handlePauseResume}
                    onEdit={handleEdit}
                    onCancel={handleCancel}
                  />
                ))}
              </div>
            </div>
          )}

          {cancelledSubscriptions.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('subscription.inactiveSubscriptions')}
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {cancelledSubscriptions.map(subscription => (
                  <SubscriptionCard
                    key={subscription.id}
                    subscription={subscription}
                    onPauseResume={handlePauseResume}
                    onEdit={handleEdit}
                    onCancel={handleCancel}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Subscription Modal */}
      {editingSubscription && (
        <EditSubscriptionModal
          subscription={editingSubscription}
          onSave={handleSaveEdit}
          onCancel={() => setEditingSubscription(null)}
        />
      )}

      {/* Cancel Subscription Modal */}
      {cancellingSubscription && (
        <CancelSubscriptionModal
          subscription={cancellingSubscription}
          onConfirm={handleConfirmCancel}
          onCancel={() => setCancellingSubscription(null)}
        />
      )}

      {/* Create Subscription Modal */}
      {isCreating && (
        <CreateSubscriptionModal
          products={products}
          onSave={handleSaveNewSubscription}
          onCancel={() => setIsCreating(false)}
        />
      )}
    </div>
  );
};

export default Subscriptions;
