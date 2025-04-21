import { useState } from 'react';
import QuoteForm from './QuoteForm';
import SuccessMessage from './SuccessMessage';
import AssistanceCard from './AssistanceCard';

const QuoteFormSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    businessType: '',
    hearAboutUs: '',
    terms: false
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: checked
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send the form data to a server
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
  };

  return (
    <section id="quote-form" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-200/20 rounded-full -translate-y-1/2 -translate-x-1/3 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-200/20 rounded-full translate-y-1/3 translate-x-1/4 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block bg-gradient-to-r from-green-600 to-green-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-3 shadow-sm">
            GET STARTED TODAY
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
            Request a Wholesale Quote
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Fill out the form below and our wholesale team will get back to you with a customized quote within 24 hours.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {formSubmitted ? (
            <SuccessMessage />
          ) : (
            <QuoteForm 
              formData={formData}
              handleChange={handleChange}
              handleCheckboxChange={handleCheckboxChange}
              handleSubmit={handleSubmit}
            />
          )}
          
          <AssistanceCard />
        </div>
      </div>
    </section>
  );
};

export default QuoteFormSection;
