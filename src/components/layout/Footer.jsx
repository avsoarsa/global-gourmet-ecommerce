import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faPinterest } from '@fortawesome/free-brands-svg-icons';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Newsletter */}
        <div className="mb-10 pb-10 border-b border-gray-700">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-2xl font-semibold mb-4">Join Our Newsletter</h3>
            <p className="text-gray-300 mb-6">
              Subscribe to receive updates on new products, special offers, and health tips from our nutrition experts.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-2 rounded-l text-gray-800 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-r font-medium transition duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h4 className="text-xl font-bold mb-4">Global Gourmet</h4>
            <p className="text-gray-300 mb-4">
              Premium quality dry fruits, spices, and whole foods sourced from around the world.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                <FontAwesomeIcon icon={faFacebook} size="lg" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                <FontAwesomeIcon icon={faPinterest} size="lg" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-xl font-bold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/category/dry-fruits" className="text-gray-300 hover:text-white transition duration-300">
                  Dry Fruits
                </Link>
              </li>
              <li>
                <Link to="/category/nuts-seeds" className="text-gray-300 hover:text-white transition duration-300">
                  Nuts & Seeds
                </Link>
              </li>
              <li>
                <Link to="/category/spices" className="text-gray-300 hover:text-white transition duration-300">
                  Spices
                </Link>
              </li>
              <li>
                <Link to="/category/whole-foods" className="text-gray-300 hover:text-white transition duration-300">
                  Whole Foods
                </Link>
              </li>
              <li>
                <Link to="/category/sprouts" className="text-gray-300 hover:text-white transition duration-300">
                  Sprouts
                </Link>
              </li>
              <li>
                <Link to="/category/superfoods" className="text-gray-300 hover:text-white transition duration-300">
                  Superfoods
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xl font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/our-story" className="text-gray-300 hover:text-white transition duration-300">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/sustainability" className="text-gray-300 hover:text-white transition duration-300">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition duration-300">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-300 hover:text-white transition duration-300">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition duration-300">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-xl font-bold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faqs" className="text-gray-300 hover:text-white transition duration-300">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="text-gray-300 hover:text-white transition duration-300">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="text-gray-300 hover:text-white transition duration-300">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-white transition duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-300 hover:text-white transition duration-300">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/bulk-orders" className="text-gray-300 hover:text-white transition duration-300">
                  Bulk Orders
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-8 border-t border-gray-700 text-center sm:flex sm:justify-between sm:items-center">
          <p className="text-gray-400 mb-4 sm:mb-0">
            © {currentYear} Global Gourmet. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4">
            <span className="text-gray-400">
              <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
              Visa
            </span>
            <span className="text-gray-400">Mastercard</span>
            <span className="text-gray-400">Amex</span>
            <span className="text-gray-400">PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
