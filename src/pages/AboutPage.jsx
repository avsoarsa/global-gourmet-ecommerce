import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLeaf, faGlobeAmericas, faHandshake,
  faShippingFast, faUsers, faAward
} from '@fortawesome/free-solid-svg-icons';

const AboutPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1506368249639-73a05d6f6488?q=80&w=1000&auto=format&fit=crop')",
            backgroundBlendMode: "overlay"
          }}
        ></div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Story</h1>
            <p className="text-xl mb-8">
              From a small family business to an internationally recognized supplier of premium dry fruits,
              spices, and whole foods.
            </p>
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Our Journey</h2>
            <p className="text-gray-700 mb-6 text-lg">
              Founded in 2010, Global Gourmet began as a small family business with a simple mission: to bring
              the finest quality dry fruits and spices from around the world to discerning customers who value
              premium, natural products.
            </p>
            <p className="text-gray-700 mb-6 text-lg">
              What started as a modest operation has grown into an internationally recognized supplier, but our
              core values remain unchanged. We continue to work directly with farmers and producers across the
              globe to ensure that every product we offer meets our exacting standards for quality, freshness,
              and sustainability.
            </p>
            <p className="text-gray-700 mb-6 text-lg">
              Today, Global Gourmet serves customers in over 50 countries, offering an extensive range of premium
              dry fruits, nuts, seeds, spices, whole foods, sprouts, and superfoods. Our commitment to excellence
              has earned us the trust of thousands of satisfied customers, from individual health enthusiasts to
              high-end restaurants and retailers.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faLeaf} className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality</h3>
              <p className="text-gray-600">
                We are uncompromising in our commitment to offering only the finest quality products.
                Every item undergoes rigorous quality control before reaching our customers.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faGlobeAmericas} className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
              <p className="text-gray-600">
                We are committed to environmentally responsible practices throughout our supply chain,
                from sourcing to packaging and shipping.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faHandshake} className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fair Trade</h3>
              <p className="text-gray-600">
                We believe in ethical business practices and fair compensation for farmers and producers,
                building long-term relationships based on mutual respect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="John Smith"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">John Smith</h3>
                <p className="text-gray-600 mb-4">Founder & CEO</p>
                <p className="text-gray-700">
                  With over 20 years of experience in the food industry, John founded Global Gourmet
                  with a vision to bring premium quality products to health-conscious consumers worldwide.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="Maria Rodriguez"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">Maria Rodriguez</h3>
                <p className="text-gray-600 mb-4">Chief Sourcing Officer</p>
                <p className="text-gray-700">
                  Maria travels the world to find the finest quality products and build relationships
                  with farmers and producers who share our commitment to quality and sustainability.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src="https://randomuser.me/api/portraits/men/22.jpg"
                alt="David Chen"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">David Chen</h3>
                <p className="text-gray-600 mb-4">Head of Operations</p>
                <p className="text-gray-700">
                  David ensures that our supply chain runs smoothly, from sourcing to packaging and
                  shipping, maintaining our high standards at every step of the process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-12">
              <h2 className="text-3xl font-bold mb-6">Our Approach</h2>

              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faLeaf} className="text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold mb-2">Direct Sourcing</h3>
                    <p className="text-gray-600">
                      We work directly with farmers and producers to ensure the highest quality products
                      while supporting sustainable farming practices.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faAward} className="text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold mb-2">Quality Control</h3>
                    <p className="text-gray-600">
                      Every product undergoes rigorous testing and quality control before being approved
                      for our catalog, ensuring consistent premium quality.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faShippingFast} className="text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold mb-2">Careful Handling</h3>
                    <p className="text-gray-600">
                      Our products are carefully processed, packaged, and shipped to preserve their
                      freshness, flavor, and nutritional value.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faUsers} className="text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold mb-2">Customer Focus</h3>
                    <p className="text-gray-600">
                      We prioritize customer satisfaction, offering personalized service and standing
                      behind every product we sell with a satisfaction guarantee.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1595475207225-428b62bda831?q=80&w=1000&auto=format&fit=crop"
                alt="Farmers harvesting spices"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-green-700 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">13+</div>
              <div>Years in Business</div>
            </div>

            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div>Countries Served</div>
            </div>

            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div>Products</div>
            </div>

            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div>Happy Clients</div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default AboutPage;
