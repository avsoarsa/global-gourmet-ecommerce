import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/testUtils';
import CurrencySelector from '../CurrencySelector';

// Mock the RegionContext
jest.mock('../../../context/RegionContext', () => ({
  ...jest.requireActual('../../../context/RegionContext'),
  useRegion: () => ({
    currency: 'USD',
    currencySymbol: '$',
    changeCurrency: jest.fn(),
    availableCurrencies: [
      { code: 'USD', name: 'US Dollar', symbol: '$' },
      { code: 'EUR', name: 'Euro', symbol: '€' },
      { code: 'GBP', name: 'British Pound', symbol: '£' }
    ],
    exchangeRates: {
      base: 'USD',
      rates: {
        USD: 1,
        EUR: 0.85,
        GBP: 0.75
      }
    }
  })
}));

describe('CurrencySelector', () => {
  test('renders compact currency selector correctly', () => {
    renderWithProviders(<CurrencySelector compact={true} />);
    
    // Check if the current currency is displayed
    expect(screen.getByText('USD')).toBeInTheDocument();
    
    // Check if the dropdown is initially closed
    expect(screen.queryByText('Select Currency')).not.toBeInTheDocument();
  });
  
  test('opens dropdown when clicked', () => {
    renderWithProviders(<CurrencySelector compact={true} />);
    
    // Click the currency selector button
    fireEvent.click(screen.getByText('USD'));
    
    // Check if the dropdown is open
    expect(screen.getByText('Select Currency')).toBeInTheDocument();
    expect(screen.getByText('Live exchange rates')).toBeInTheDocument();
  });
  
  test('displays available currencies in dropdown', async () => {
    renderWithProviders(<CurrencySelector compact={true} />);
    
    // Click the currency selector button
    fireEvent.click(screen.getByText('USD'));
    
    // Check if all currencies are displayed
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getByText('EUR')).toBeInTheDocument();
    expect(screen.getByText('GBP')).toBeInTheDocument();
    
    // Check if currency names are displayed
    expect(screen.getByText('- US Dollar')).toBeInTheDocument();
    expect(screen.getByText('- Euro')).toBeInTheDocument();
    expect(screen.getByText('- British Pound')).toBeInTheDocument();
  });
  
  test('displays exchange rates for non-selected currencies', () => {
    renderWithProviders(<CurrencySelector compact={true} />);
    
    // Click the currency selector button
    fireEvent.click(screen.getByText('USD'));
    
    // USD is selected, so it should show a check mark instead of exchange rate
    expect(screen.queryByText('$1 = $1')).not.toBeInTheDocument();
    
    // Check if exchange rates are displayed for other currencies
    expect(screen.getByText('$1 = €0.8500')).toBeInTheDocument();
    expect(screen.getByText('$1 = £0.7500')).toBeInTheDocument();
  });
  
  test('calls changeCurrency when a currency is selected', () => {
    const { container } = renderWithProviders(<CurrencySelector compact={true} />);
    
    // Click the currency selector button
    fireEvent.click(screen.getByText('USD'));
    
    // Find the EUR button and click it
    const eurButton = screen.getByText('EUR').closest('button');
    fireEvent.click(eurButton);
    
    // Check if changeCurrency was called with 'EUR'
    expect(require('../../../context/RegionContext').useRegion().changeCurrency).toHaveBeenCalledWith('EUR');
  });
  
  test('renders full currency selector correctly', () => {
    renderWithProviders(<CurrencySelector compact={false} />);
    
    // Check if the title is displayed
    expect(screen.getByText('Select Currency')).toBeInTheDocument();
    
    // Check if all currencies are displayed
    expect(screen.getByText('US Dollar')).toBeInTheDocument();
    expect(screen.getByText('Euro')).toBeInTheDocument();
    expect(screen.getByText('British Pound')).toBeInTheDocument();
    
    // Check if the active currency is highlighted
    const activeButton = screen.getByText('US Dollar').closest('button');
    expect(activeButton).toHaveTextContent('Active');
  });
});
