import React, { useEffect, useState } from 'react';
import { ChefHat, UtensilsCrossed, Sparkles, MapPin } from 'lucide-react';
import axios from "axios";

function Menu() {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await fetch(`${apiUrl}/menu`);
                const data = await response.json();
                setMenuItems(data);
            } catch (error) {
                console.error("Error fetching menu items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenuItems();
    }, []);

    const handleMapClick = (address) => {
        const encodedAddress = encodeURIComponent(address);
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-orange-600 font-medium">Loading delicious items...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center mb-6">
                        <UtensilsCrossed className="w-14 h-14 text-orange-600 mr-4 animate-pulse" />
                        <h1 className="text-6xl font-bold bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            Today's Menu
                        </h1>
                        <Sparkles className="w-14 h-14 text-orange-600 ml-4 animate-pulse" />
                    </div>
                    <p className="text-gray-600 text-xl font-medium">Crafted with love by our talented chefs</p>
                    <div className="mt-4 h-1 w-32 bg-linear-to-r from-orange-400 to-red-400 mx-auto rounded-full"></div>
                </div>

                {/* Menu Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {menuItems.map((f, index) => (
                        <div 
                            key={index}
                            className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-orange-100 hover:scale-[1.02] hover:-translate-y-1"
                        >
                            {/* Chef Header */}
                            <div className="bg-linear-to-r from-orange-500 via-red-500 to-orange-500 p-8 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
                                
                                <div className="relative flex items-start justify-between">
                                    <div className="flex items-center flex-1">
                                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mr-5 shadow-lg">
                                            <ChefHat className="w-10 h-10" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium opacity-90 mb-1">Prepared by</p>
                                            <h3 className="text-3xl font-bold mb-3">{f.chefId.messName}</h3>
                                            <div className="flex items-start space-x-2">
                                                <MapPin className="w-5 h-5 mt-0.5 shrink-0" />
                                                <p className="text-white/95 text-sm leading-relaxed flex-1">
                                                    {f.chefId.messAddress}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleMapClick(f.chefId.messAddress)}
                                        className="ml-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-3 transition-all duration-300 hover:scale-110 shadow-lg group"
                                        title="View on Map"
                                    >
                                        <MapPin className="w-6 h-6 group-hover:animate-bounce" />
                                    </button>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="p-8">
                                <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                    <span className="w-3 h-3 bg-linear-to-r from-orange-500 to-red-500 rounded-full mr-3 animate-pulse"></span>
                                    Today's Specialties
                                </h4>
                                <ul className="space-y-2">
                                    {Object.entries(f.item).map(([name, price]) => (
                                        <li 
                                            key={name}
                                            className="flex justify-between items-center p-4 rounded-xl hover:bg-linear-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-300 group border-2 border-transparent hover:border-orange-200"
                                        >
                                            <span className="text-gray-700 font-semibold group-hover:text-orange-700 transition-colors text-lg">
                                                {name}
                                            </span>
                                            <span className="bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-bold text-xl">
                                                ₹{price}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Decorative Bottom */}
                            <div className="h-2 bg-linear-to-r from-orange-400 via-red-500 to-orange-400"></div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {menuItems.length === 0 && (
                    <div className="text-center py-32">
                        <div className="bg-white rounded-3xl shadow-lg p-16 max-w-md mx-auto">
                            <UtensilsCrossed className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                            <p className="text-gray-500 text-2xl font-semibold">No menu items available</p>
                            <p className="text-gray-400 mt-2">Check back soon for delicious updates!</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Menu;