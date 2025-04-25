import { Link } from 'react-router-dom';

import backgroundImage from '../../assets/hero.jpg';
import foodie from '../../assets/foodie.png';

const JoinUs_Restaurant = () => {

    const backgroundStyle = {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '30vh',
        padding: '40px',
        color: 'white',
    };   

    return (
        <div>
            <div style={backgroundStyle}>
                <h1 className="text-3xl font-bold mb-4 mt-12 text-center">Restaurants</h1>
            </div>
            <div className="bg-primary-50 text-black p-10 min-h-[30vh] bg-cover bg-center">
                <h2 className="text-xl mb-10 text-center">
                    Foodie is your ultimate food delivery companion, 
                    designed to fit right into your fast-paced lifestyle. 
                    Whether you are craving local favorites, trendy street eats, 
                    or gourmet meals, Foodie brings the best of Sri Lanka culinary scene 
                    straight to your doorstep.                
                </h2>
                <h4 className="mb-4 text-center">
                    Foodie is your ultimate food delivery companion,
                    designed to fit right into your fast-paced lifestyle.
                    Whether you are craving local favorites, trendy street eats,
                    or gourmet meals, Foodie brings the best of Sri Lanka culinary scene
                    straight to your doorstep.
                </h4>
            </div>  
               
            <div className="bg-primary-100 text-primary-900 p-10 min-h-[30vh] bg-cover bg-center">
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                    {/* Left Column: Text */}
                    <div className="w-full lg:w-1/2">
                        <h1 className="text-3xl font-bold mb-6">🌟 Why Choose Foodie?</h1>
                        <h4 className="text-justify space-y-4">
                            <p><strong>Curated Culinary Experiences</strong><br />
                                Discover handpicked dishes and signature meals from top-rated kitchens, delivered fresh to your door.</p>

                            <p><strong>Effortless Reordering</strong><br />
                                Reorder your past favorites in seconds with no need to scroll endlessly.</p>

                            <p><strong>Smart Search and Filters</strong><br />
                                Easily find what you’re craving with intelligent search and dietary preference filters.</p>

                            <p><strong>Real-Time Order Updates</strong><br />
                                Get instant updates on your order status along with accurate delivery time estimates.</p>

                            <p><strong>Seamless Group Orders</strong><br />
                                Place and split group orders with ease, perfect for friends, families, and teams.</p>

                            <p><strong>Exclusive Deals and Promos</strong><br />
                                Enjoy app-only discounts, combo offers, and seasonal specials tailored just for you.</p>

                            <p><strong>Local Gems and Global Flavors</strong><br />
                                Explore a wide range of cuisines, from beloved local favorites to international delights.</p>

                            <p><strong>One-Tap Support</strong><br />
                                Reach out to customer care instantly with in-app chat and simple feedback tools.</p>

                            <p><strong>Eco-Friendly Packaging</strong><br />
                                Order from vendors committed to sustainable and environmentally conscious practices.</p>

                            <p><strong>Customizable Profiles</strong><br />
                                Save your addresses, food preferences, allergies, and payment methods for faster and easier checkouts.</p>
                        </h4>
                    </div>

                    {/* Right Column: Image */}
                    <img
                        src={foodie}
                        alt="Foodie - Enjoy delicious food delivered to your door"
                        className="w-full h-full lg:w-1/2 flex justify-center"
                        onError={(e) => e.target.src = '/path/to/fallback-image.jpg'}
                    />
                </div>
            </div> 
            <div className="bg-primary-50 text-black p-10 min-h-[30vh] bg-cover bg-center">
                <h1 className="text-xl mb-4 text-center">
                    🍽️ We are Craving the Best – Are You In?
                </h1>
                <h1 className="mb-4"><strong>Why Partner with Foodie?</strong><br /></h1>
                <h3 className="mb-6 leading-loose">                   

                    🚀 Expand your reach with a wide customer base <br />

                    📲 Get orders seamlessly through our intuitive app <br />

                    📦 Reliable delivery with real-time tracking <br />

                    💼 Powerful dashboard to manage orders and insights <br />

                    🎯 Boost visibility with marketing & promo opportunities <br />
                </h3>
                <h3 className="mb-4 text-center">
                    Ready to grow your business with Foodie?
                    Let’s serve happiness together — one delicious meal at a time.
                </h3>
                <div className="flex justify-center mt-6">
                    <Link
                        to="/restaurant/createRestaurant"
                        className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition duration-300"
                    >
                        Join Us
                    </Link>
                </div>
            </div> 
        </div>
    );
};

export default JoinUs_Restaurant;
