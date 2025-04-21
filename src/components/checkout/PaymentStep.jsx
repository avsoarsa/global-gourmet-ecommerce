import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCreditCard,
  faMoneyBillWave,
  faUniversity,
  faShieldAlt,
  faLock,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import {
  faCcVisa,
  faCcMastercard,
  faCcAmex,
  faCcDiscover,
  faCcPaypal,
  faApplePay,
  faGooglePay
} from '@fortawesome/free-brands-svg-icons';

const PaymentMethodCard = ({ method, isSelected, onSelect }) => {
  return (
    <label
      className={`block border rounded-lg p-3 cursor-pointer transition-colors ${
        isSelected
          ? 'border-green-500 bg-green-50'
          : 'border-gray-200 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center">
        <input
          type="radio"
          name="paymentMethod"
          checked={isSelected}
          onChange={() => onSelect(method.id)}
          className="form-radio text-green-600"
        />
        <div className="ml-3 flex items-center">
          <div className="w-8 text-xl text-gray-600">
            <FontAwesomeIcon icon={method.icon} />
          </div>
          <div className="ml-3">
            <div className="font-medium text-gray-900">{method.name}</div>
            {method.description && (
              <div className="text-sm text-gray-500">{method.description}</div>
            )}
          </div>
        </div>
      </div>
    </label>
  );
};

const CreditCardForm = ({ onSubmit }) => {
  const { t } = useTranslation();
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    saveCard: false
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCardData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!cardData.cardNumber.trim()) {
      newErrors.cardNumber = t('checkout.cardNumberRequired');
    } else if (!/^\d{16}$/.test(cardData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = t('checkout.invalidCardNumber');
    }

    if (!cardData.cardName.trim()) {
      newErrors.cardName = t('checkout.cardNameRequired');
    }

    if (!cardData.expiryMonth) {
      newErrors.expiryMonth = t('checkout.expiryMonthRequired');
    }

    if (!cardData.expiryYear) {
      newErrors.expiryYear = t('checkout.expiryYearRequired');
    }

    if (!cardData.cvv.trim()) {
      newErrors.cvv = t('checkout.cvvRequired');
    } else if (!/^\d{3,4}$/.test(cardData.cvv)) {
      newErrors.cvv = t('checkout.invalidCvv');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(cardData);
    }
  };

  // Generate month options
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return (
      <option key={month} value={month.toString().padStart(2, '0')}>
        {month.toString().padStart(2, '0')}
      </option>
    );
  });

  // Generate year options (current year + 10 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => {
    const year = currentYear + i;
    return (
      <option key={year} value={year}>
        {year}
      </option>
    );
  });

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-4">
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
          {t('checkout.cardNumber')} *
        </label>
        <div className="relative">
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={cardData.cardNumber}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            className={`form-input w-full pl-10 ${errors.cardNumber ? 'border-red-500' : ''}`}
            maxLength="19"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <FontAwesomeIcon icon={faCreditCard} />
          </div>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1 text-gray-400">
            <FontAwesomeIcon icon={faCcVisa} />
            <FontAwesomeIcon icon={faCcMastercard} />
            <FontAwesomeIcon icon={faCcAmex} />
          </div>
        </div>
        {errors.cardNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
          {t('checkout.nameOnCard')} *
        </label>
        <input
          type="text"
          id="cardName"
          name="cardName"
          value={cardData.cardName}
          onChange={handleChange}
          placeholder="John Doe"
          className={`form-input w-full ${errors.cardName ? 'border-red-500' : ''}`}
        />
        {errors.cardName && (
          <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('checkout.expiryDate')} *
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <select
                name="expiryMonth"
                value={cardData.expiryMonth}
                onChange={handleChange}
                className={`form-select w-full ${errors.expiryMonth ? 'border-red-500' : ''}`}
              >
                <option value="">{t('checkout.month')}</option>
                {monthOptions}
              </select>
              {errors.expiryMonth && (
                <p className="mt-1 text-sm text-red-600">{errors.expiryMonth}</p>
              )}
            </div>
            <div>
              <select
                name="expiryYear"
                value={cardData.expiryYear}
                onChange={handleChange}
                className={`form-select w-full ${errors.expiryYear ? 'border-red-500' : ''}`}
              >
                <option value="">{t('checkout.year')}</option>
                {yearOptions}
              </select>
              {errors.expiryYear && (
                <p className="mt-1 text-sm text-red-600">{errors.expiryYear}</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
            {t('checkout.cvv')} *
          </label>
          <div className="relative">
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={cardData.cvv}
              onChange={handleChange}
              placeholder="123"
              maxLength="4"
              className={`form-input w-full ${errors.cvv ? 'border-red-500' : ''}`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FontAwesomeIcon icon={faLock} />
            </div>
          </div>
          {errors.cvv && (
            <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="saveCard"
            checked={cardData.saveCard}
            onChange={handleChange}
            className="form-checkbox h-4 w-4 text-green-600"
          />
          <span className="ml-2 text-sm text-gray-700">
            {t('checkout.saveCardForFuture')}
          </span>
        </label>
      </div>

      <div className="bg-blue-50 p-3 rounded-md mb-4 flex items-start">
        <div className="text-blue-500 mt-1">
          <FontAwesomeIcon icon={faShieldAlt} />
        </div>
        <div className="ml-3">
          <h4 className="text-sm font-medium text-blue-800">
            {t('checkout.securePayment')}
          </h4>
          <p className="text-sm text-blue-700 mt-1">
            {t('checkout.securePaymentDesc')}
          </p>
        </div>
      </div>
    </form>
  );
};

const PaypalForm = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-4">
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <FontAwesomeIcon icon={faCcPaypal} className="text-4xl text-blue-600 mb-4" />
        <p className="text-gray-700 mb-4">
          {t('checkout.paypalDesc')}
        </p>
        <div className="bg-yellow-50 p-3 rounded-md mb-4 flex items-start">
          <div className="text-yellow-500 mt-1">
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>
          <div className="ml-3 text-left">
            <p className="text-sm text-yellow-700">
              {t('checkout.paypalRedirectInfo')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const BankTransferForm = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-4">
          {t('checkout.bankTransferInstructions')}
        </h4>
        <div className="space-y-3 text-sm text-gray-700">
          <p>{t('checkout.bankTransferDesc')}</p>
          <div className="bg-white p-3 rounded-md border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">{t('checkout.bankName')}:</p>
                <p className="font-medium">Global Bank</p>
              </div>
              <div>
                <p className="text-gray-500">{t('checkout.accountName')}:</p>
                <p className="font-medium">Global Gourmet Inc.</p>
              </div>
              <div>
                <p className="text-gray-500">{t('checkout.accountNumber')}:</p>
                <p className="font-medium">1234567890</p>
              </div>
              <div>
                <p className="text-gray-500">{t('checkout.routingNumber')}:</p>
                <p className="font-medium">987654321</p>
              </div>
              <div>
                <p className="text-gray-500">{t('checkout.swift')}:</p>
                <p className="font-medium">GLBLUSD123</p>
              </div>
            </div>
          </div>
          <p className="text-red-600 font-medium">
            {t('checkout.bankTransferWarning')}
          </p>
        </div>
      </div>
    </div>
  );
};

const ExpressCheckoutOptions = () => {
  const { t } = useTranslation();

  return (
    <div className="mb-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {t('checkout.expressCheckout')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="btn-outline flex items-center justify-center py-3">
          <FontAwesomeIcon icon={faApplePay} className="text-2xl" />
        </button>

        <button className="btn-outline flex items-center justify-center py-3">
          <FontAwesomeIcon icon={faGooglePay} className="text-2xl" />
        </button>

        <button className="btn-outline flex items-center justify-center py-3">
          <FontAwesomeIcon icon={faCcPaypal} className="text-2xl text-blue-600" />
        </button>
      </div>

      <div className="relative flex items-center mt-6 mb-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-600 text-sm">
          {t('checkout.or')}
        </span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
    </div>
  );
};

const PaymentStep = ({ onNext, onBack, paymentMethod, setPaymentMethod }) => {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState(paymentMethod || 'credit-card');
  const [cardData, setCardData] = useState(null);

  // Payment methods
  const paymentMethods = [
    {
      id: 'credit-card',
      name: t('checkout.creditCard'),
      icon: faCreditCard,
      description: t('checkout.creditCardDesc')
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: faCcPaypal,
      description: t('checkout.paypalDesc')
    },
    {
      id: 'bank-transfer',
      name: t('checkout.bankTransfer'),
      icon: faUniversity,
      description: t('checkout.bankTransferDesc')
    }
  ];

  const handleContinue = () => {
    // Update payment method
    setPaymentMethod({
      type: selectedMethod,
      ...(cardData && { cardData })
    });

    onNext();
  };

  const handleCardSubmit = (data) => {
    setCardData(data);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {t('checkout.paymentInformation')}
      </h2>

      <ExpressCheckoutOptions />

      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {t('checkout.paymentMethod')}
        </h3>

        <div className="space-y-4">
          {paymentMethods.map(method => (
            <PaymentMethodCard
              key={method.id}
              method={method}
              isSelected={selectedMethod === method.id}
              onSelect={setSelectedMethod}
            />
          ))}
        </div>
      </div>

      {/* Render form based on selected payment method */}
      {selectedMethod === 'credit-card' && (
        <CreditCardForm onSubmit={handleCardSubmit} />
      )}

      {selectedMethod === 'paypal' && (
        <PaypalForm />
      )}

      {selectedMethod === 'bank-transfer' && (
        <BankTransferForm />
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="btn-outline"
        >
          {t('checkout.back')}
        </button>

        <button
          onClick={handleContinue}
          className="btn-primary"
        >
          {t('checkout.continue')}
        </button>
      </div>
    </div>
  );
};

export default PaymentStep;
