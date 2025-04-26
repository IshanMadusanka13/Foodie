import { useState } from 'react';

const Favorites = ({ favorites, removeFavorite }) => {
    if (favorites.length === 0) {
        return <div className="p-4 text-center text-gray-500">No favorite items yet.</div>;
    }

    return (
        <div className="p-6 bg-white rounded shadow-md max-w-2xl mx-auto mt-6">
            <h2 className="text-2xl font-bold mb-4">Your Favorites</h2>
            <div className="grid gap-4">
                {favorites.map((item) => (
                    <div key={item._id} className="border p-4 rounded flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-semibold">{item.name}</h3>
                            <p className="text-green-600 font-bold mt-2">${item.price.toFixed(2)}</p>
                        </div>
                        <button
                            onClick={() => removeFavorite(item._id)}
                            className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Favorites;
