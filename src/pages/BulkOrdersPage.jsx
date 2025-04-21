import React from 'react';
import HeroSection from '../components/bulk-orders/HeroSection';
import BenefitsSection from '../components/bulk-orders/BenefitsSection';
import BusinessTypesSection from '../components/bulk-orders/BusinessTypesSection';
import QuoteFormSection from '../components/bulk-orders/QuoteFormSection';
import TestimonialsSection from '../components/bulk-orders/TestimonialsSection';

const BulkOrdersPage = () => {
  return (
    <div>
      <HeroSection />
      <BenefitsSection />
      <BusinessTypesSection />
      <QuoteFormSection />
      <TestimonialsSection />
    </div>
  );
};

export default BulkOrdersPage;
