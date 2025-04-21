import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/testUtils';
import SavedPaymentMethods from '../SavedPaymentMethods';
import { mockUser } from '../../../utils/testUtils';

// Mock the AuthContext
jest.mock('../../../context/AuthContext', () => ({
  ...jest.requireActual('../../../context/AuthContext'),
  useAuth: () => ({
    currentUser: {
      ...mockUser,
      paymentMethods: [
        {
          id: '1',
          cardNumber: '4111111111111111',
          cardholderName: 'Test User',
          expiryMonth: '12',
          expiryYear: '2030',
          cardType: 'visa',
          isDefault: true
        }
      ]
    },
    updateUserProfile: jest.fn()
  })
}));

describe('SavedPaymentMethods', () => {
  test('renders saved payment methods correctly', () => {
    renderWithProviders(<SavedPaymentMethods />);
    
    // Check if the component title is displayed
    expect(screen.getByText('Saved Payment Methods')).toBeInTheDocument();
    
    // Check if the saved card is displayed
    expect(screen.getByText(/•••• •••• •••• 1111/)).toBeInTheDocument();
    expect(screen.getByText(/Test User/)).toBeInTheDocument();
    expect(screen.getByText(/Expires 12\/30/)).toBeInTheDocument();
    expect(screen.getByText('Default Payment Method')).toBeInTheDocument();
  });
  
  test('opens add payment method form when button is clicked', () => {
    renderWithProviders(<SavedPaymentMethods />);
    
    // Click the add payment method button
    fireEvent.click(screen.getByText('Add Payment Method'));
    
    // Check if the form is displayed
    expect(screen.getByText('Add New Payment Method')).toBeInTheDocument();
    expect(screen.getByLabelText('Card Number *')).toBeInTheDocument();
    expect(screen.getByLabelText('Cardholder Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Expiration Date *')).toBeInTheDocument();
    expect(screen.getByLabelText('CVV *')).toBeInTheDocument();
  });
  
  test('validates form fields correctly', async () => {
    renderWithProviders(<SavedPaymentMethods />);
    
    // Click the add payment method button
    fireEvent.click(screen.getByText('Add Payment Method'));
    
    // Submit the form without filling any fields
    fireEvent.click(screen.getByText('Save Payment Method'));
    
    // Check if validation errors are displayed
    await waitFor(() => {
      expect(screen.getByText('Card number is required')).toBeInTheDocument();
      expect(screen.getByText('Cardholder name is required')).toBeInTheDocument();
      expect(screen.getByText('Month is required')).toBeInTheDocument();
      expect(screen.getByText('CVV is required')).toBeInTheDocument();
    });
  });
  
  test('detects card type based on card number', () => {
    renderWithProviders(<SavedPaymentMethods />);
    
    // Click the add payment method button
    fireEvent.click(screen.getByText('Add Payment Method'));
    
    // Enter a Visa card number
    const cardNumberInput = screen.getByLabelText('Card Number *');
    fireEvent.change(cardNumberInput, { target: { value: '4111 1111 1111 1111' } });
    
    // Check if the card number is formatted correctly
    expect(cardNumberInput.value).toBe('4111 1111 1111 1111');
  });
  
  test('allows editing an existing payment method', () => {
    renderWithProviders(<SavedPaymentMethods />);
    
    // Find and click the edit button
    const editButton = screen.getAllByRole('button')[2]; // The edit button
    fireEvent.click(editButton);
    
    // Check if the form is in edit mode
    expect(screen.getByText('Edit Payment Method')).toBeInTheDocument();
    
    // Check if the form is pre-filled with the card data
    expect(screen.getByLabelText('Cardholder Name *').value).toBe('Test User');
    
    // The card number should be masked in the input
    const cardNumberInput = screen.getByLabelText('Card Number *');
    expect(cardNumberInput.value).toBe('4111 1111 1111 1111');
  });
  
  test('allows deleting a payment method', async () => {
    const { container } = renderWithProviders(<SavedPaymentMethods />);
    
    // Find and click the delete button
    const deleteButton = screen.getAllByRole('button')[3]; // The delete button
    fireEvent.click(deleteButton);
    
    // Check if the updateUserProfile function was called
    await waitFor(() => {
      expect(require('../../../context/AuthContext').useAuth().updateUserProfile).toHaveBeenCalledWith({
        paymentMethods: []
      });
    });
    
    // Check if success message is displayed
    expect(screen.getByText('Payment method removed successfully')).toBeInTheDocument();
  });
});
