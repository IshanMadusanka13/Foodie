import PropTypes from 'prop-types';
import { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import backgroundImage from '../../assets/hero.jpg';
import foodie from '../../assets/foodie.jpg';

const JoinUs = ({ setActiveView }) => {
    const { darkMode } = useContext(ThemeContext);

    const backgroundStyle = {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '30vh',
        padding: '40px',
        color: 'white',
    };

    // Theme classes
    const sectionClasses = (baseColor) => {
        const light = `bg-${baseColor}-50 text-black`;
        const dark = `bg-gray-800 text-gray-200`;
        return darkMode ? dark : light;
    };

    const primarySectionClasses = sectionClasses('primary');
    const secondarySectionClasses = sectionClasses('primary');
    const tertiarySectionClasses = sectionClasses('primary');

    const headingClasses = `text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`;
    const subHeadingClasses = `text-xl mb-10 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`;
    const paragraphClasses = `mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`;
    const listItemClasses = `mb-2 leading-loose ${darkMode ? 'text-gray-300' : 'text-gray-700'}`;
    const buttonClasses = `px-6 py-3 rounded-lg transition duration-300 ${darkMode
            ? 'bg-primary-600 text-white hover:bg-primary-500'
            : 'bg-primary-500 text-white hover:bg-primary-600'
        }`;

    return (
        <div className={darkMode ? 'bg-gray-900' : 'bg-white'}>
            {/* Hero Section */}
            <div style={backgroundStyle}>
                <h1 className="text-3xl font-bold mb-4 mt-12 text-center">Restaurants</h1>
            </div>

            {/* Introduction Section */}
            <div className={`${primarySectionClasses} p-10 min-h-[30vh] bg-cover bg-center`}>
                <h2 className={subHeadingClasses}>
                    Foodie is your ultimate food delivery companion,
                    designed to fit right into your fast-paced lifestyle.
                    Whether you are craving local favorites, trendy street eats,
                    or gourmet meals, Foodie brings the best of Sri Lanka culinary scene
                    straight to your doorstep.
                </h2>
                <h4 className={`${paragraphClasses} text-center`}>
                    Foodie is your ultimate food delivery companion,
                    designed to fit right into your fast-paced lifestyle.
                    Whether you are craving local favorites, trendy street eats,
                    or gourmet meals, Foodie brings the best of Sri Lanka culinary scene
                    straight to your doorstep.
                </h4>
            </div>

            {/* Features Section */}
            <div className={`${secondarySectionClasses} p-10 min-h-[30vh] bg-cover bg-center`}>
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                    {/* Left Column: Text */}
                    <div className="w-full lg:w-1/2">
                        <h1 className={headingClasses}>🌟 Why Choose Foodie?</h1>
                        <div className="text-justify space-y-4">
                            <p className={paragraphClasses}>
                                <strong className={darkMode ? 'text-white' : 'text-black'}>Curated Culinary Experiences</strong><br />
                                Discover handpicked dishes and signature meals from top-rated kitchens, delivered fresh to your door.
                            </p>

                            <p className={paragraphClasses}>
                                <strong className={darkMode ? 'text-white' : 'text-black'}>Effortless Reordering</strong><br />
                                Reorder your past favorites in seconds with no need to scroll endlessly.
                            </p>

                            <p className={paragraphClasses}>
                                <strong className={darkMode ? 'text-white' : 'text-black'}>Smart Search and Filters</strong><br />
                                Easily find what you're craving with intelligent search and dietary preference filters.
                            </p>

                            <p className={paragraphClasses}>
                                <strong className={darkMode ? 'text-white' : 'text-black'}>Real-Time Order Updates</strong><br />
                                Get instant updates on your order status along with accurate delivery time estimates.
                            </p>

                            <p className={paragraphClasses}>
                                <strong className={darkMode ? 'text-white' : 'text-black'}>Seamless Group Orders</strong><br />
                                Place and split group orders with ease, perfect for friends, families, and teams.
                            </p>

                            <p className={paragraphClasses}>
                                <strong className={darkMode ? 'text-white' : 'text-black'}>Exclusive Deals and Promos</strong><br />
                                Enjoy app-only discounts, combo offers, and seasonal specials tailored just for you.
                            </p>

                            <p className={paragraphClasses}>
                                <strong className={darkMode ? 'text-white' : 'text-black'}>Local Gems and Global Flavors</strong><br />
                                Explore a wide range of cuisines, from beloved local favorites to international delights.
                            </p>

                            <p className={paragraphClasses}>
                                <strong className={darkMode ? 'text-white' : 'text-black'}>One-Tap Support</strong><br />
                                Reach out to customer care instantly with in-app chat and simple feedback tools.
                            </p>

                            <p className={paragraphClasses}>
                                <strong className={darkMode ? 'text-white' : 'text-black'}>Eco-Friendly Packaging</strong><br />
                                Order from vendors committed to sustainable and environmentally conscious practices.
                            </p>

                            <p className={paragraphClasses}>
                                <strong className={darkMode ? 'text-white' : 'text-black'}>Customizable Profiles</strong><br />
                                Save your addresses, food preferences, allergies, and payment methods for faster and easier checkouts.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Image */}
                    <img
                        src={foodie}
                        alt="Foodie - Enjoy delicious food delivered to your door"
                        className="w-full h-full lg:w-1/2 flex justify-center rounded-lg shadow-lg"
                        onError={(e) => e.target.src = '/path/to/fallback-image.jpg'}
                    />
                </div>
            </div>

            {/* CTA Section */}
            <div className={`${tertiarySectionClasses} p-10 min-h-[30vh] bg-cover bg-center`}>
                <h1 className={`text-xl mb-4 text-center ${darkMode ? 'text-white' : 'text-black'}`}>
                    🍽️ We are Craving the Best – Are You In?
                </h1>
                <h1 className={`mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                    <strong>Why Partner with Foodie?</strong><br />
                </h1>
                <div className="mb-6 leading-loose">
                    <p className={listItemClasses}>🚀 Expand your reach with a wide customer base</p>
                    <p className={listItemClasses}>📲 Get orders seamlessly through our intuitive app</p>
                    <p className={listItemClasses}>📦 Reliable delivery with real-time tracking</p>
                    <p className={listItemClasses}>💼 Powerful dashboard to manage orders and insights</p>
                    <p className={listItemClasses}>🎯 Boost visibility with marketing & promo opportunities</p>
                </div>
                <h3 className={`mb-4 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Ready to grow your business with Foodie?
                    Let us serve happiness together — one delicious meal at a time.
                </h3>
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => setActiveView('createRestaurant')}
                        className={buttonClasses}
                    >
                        Join Us
                    </button>
                </div>
            </div>
        </div>
    );
};

JoinUs.propTypes = {
    setActiveView: PropTypes.func.isRequired,
};

export default JoinUs;