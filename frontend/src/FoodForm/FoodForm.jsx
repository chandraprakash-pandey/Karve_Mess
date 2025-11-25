import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Plus, Trash2, UtensilsCrossed, Save, 
  Crown, Sparkles, Star, Zap, Search, 
  AlertCircle, ChefHat, ArrowRight 
} from "lucide-react";
import Days from "./Days";

function FoodForm() {
  // --- State Management ---
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [foods, setFoods] = useState([{ name: "", price: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subs, setSubs] = useState(false);
  const [loading, setLoading] = useState(true);
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const day = params.get("day");

  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const todayDay_index = new Date();
  const todayDay = days[todayDay_index.getDay()];
  const [isAllowed, setIsAllowed] = useState(true);

  // --- Styling Configuration ---
  // This object allows us to switch themes without duplicating HTML
  const theme = subs ? {
    mode: 'premium',
    bg: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
    card: 'bg-white/10 backdrop-blur-md border border-yellow-500/30 shadow-[0_0_40px_rgba(234,179,8,0.15)]',
    text: 'text-white',
    subText: 'text-purple-200',
    input: 'bg-black/20 border-white/10 text-white placeholder-white/40 focus:border-yellow-400 focus:ring-yellow-400/20',
    accent: 'text-yellow-400',
    buttonPrimary: 'bg-gradient-to-r from-yellow-400 to-amber-600 hover:from-yellow-300 hover:to-amber-500 text-black shadow-yellow-900/20',
    buttonSecondary: 'bg-white/5 hover:bg-white/10 text-yellow-100 border border-white/10',
    iconBg: 'bg-gradient-to-br from-yellow-400 to-amber-600',
    badge: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
  } : {
    mode: 'standard',
    bg: 'bg-gradient-to-br from-orange-50 via-amber-50 to-red-50',
    card: 'bg-white border border-orange-100 shadow-xl',
    text: 'text-gray-800',
    subText: 'text-gray-500',
    input: 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20',
    accent: 'text-orange-600',
    buttonPrimary: 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white shadow-orange-500/20',
    buttonSecondary: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200',
    iconBg: 'bg-gradient-to-br from-orange-500 to-red-600',
    badge: 'bg-orange-100 text-orange-700 border border-orange-200'
  };

  // --- Effects ---
  useEffect(() => {
    axios.get("https://karve-mess-backend.onrender.com/user", { withCredentials: true })
      .then(res => {
        setUser(res.data);
        if (res.data.subscribed) setSubs(true);
        setLoading(false);
      })
      .catch(err => {
        if (err.response?.status === 401) window.location.href = "/Login";
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!subs && day !== todayDay && !loading) {
      navigate(`/foodform?day=${todayDay}`);
    }
  }, [subs, loading]);

  useEffect(() => {
    axios.get("https://karve-mess-backend.onrender.com/myItems", { withCredentials: true })
      .then(res => {
        const cnt = res.data.filter(obj => obj.day === day).length;
        setIsAllowed(cnt > 0);
      })
      .catch(err => console.log("Error in Day useEffect", err));
  }, [day]);

  // --- Handlers ---
  const addFood = () => setFoods([...foods, { name: "", price: "" }]);
  
  const removeFood = (index) => {
    if (foods.length > 1) setFoods(foods.filter((_, i) => i !== index));
  };

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFoods = [...foods];
    updatedFoods[index][name] = value;
    setFoods(updatedFoods);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const itemsMap = {};
    foods.forEach(food => {
      if (food.name.trim() !== "") itemsMap[food.name] = Number(food.price);
    });

    axios.post("https://karve-mess-backend.onrender.com/fooditems", { chefId: user._id, item: itemsMap, day }, { withCredentials: true })
      .then(() => {
        setFoods([{ name: "", price: "" }]);
        navigate("/Menu");
      })
      .catch(err => {
        console.error(err);
        setIsSubmitting(false);
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-12 px-4 transition-colors duration-500 ${theme.bg}`}>
      {/* Premium Navigation Component */}
      {subs && <Days />}

      <div className="max-w-3xl mx-auto pt-8">
        {/* Premium Header Badge */}
        {subs && (
          <div className="flex justify-center mb-8 animate-fade-in-down">
            <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-xl px-6 py-2 rounded-full border border-yellow-500/30 shadow-xl">
              <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-200 to-amber-400 font-bold tracking-wide uppercase text-sm">
                Premium Chef Dashboard
              </span>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className={`rounded-3xl overflow-hidden transition-all duration-300 ${theme.card}`}>
          
          {/* Card Header */}
          <div className="p-8 pb-0 text-center">
            <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform rotate-3 hover:rotate-0 transition-transform ${theme.iconBg}`}>
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            
            <h2 className={`text-3xl font-bold mb-2 ${theme.text}`}>
              {subs ? "Curate Your Menu" : "Add Today's Menu"}
            </h2>
            <p className={`${theme.subText} text-sm font-medium uppercase tracking-wider`}>
              Preparing for {day ? day.charAt(0).toUpperCase() + day.slice(1) : "Today"}
            </p>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* List of Inputs */}
              <div className="space-y-4">
                {foods.map((food, index) => (
                  <div 
                    key={index} 
                    className={`group relative flex items-start gap-3 p-2 rounded-xl transition-all duration-200 ${subs ? 'hover:bg-white/5' : 'hover:bg-orange-50/50'}`}
                  >
                    {/* Count Badge */}
                    <div className="pt-3 pl-1">
                       <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${theme.badge}`}>
                         {index + 1}
                       </span>
                    </div>

                    {/* Inputs Container */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      
                      {/* Name Input */}
                      <div className="sm:col-span-2 relative">
                        <UtensilsCrossed className={`absolute left-4 top-3.5 w-4 h-4 ${theme.subText} opacity-50`} />
                        <input
                          type="text"
                          name="name"
                          placeholder="Dish Name (e.g., Butter Chicken)"
                          value={food.name}
                          onChange={(e) => handleChange(index, e)}
                          className={`w-full pl-10 pr-4 py-3 rounded-xl outline-none border transition-all font-medium ${theme.input}`}
                          required
                        />
                      </div>

                      {/* Price Input */}
                      <div className="relative flex items-center gap-2">
                        <div className="relative w-full">
                          <span className={`absolute left-4 top-3.5 text-sm font-bold ${theme.subText} opacity-70`}>₹</span>
                          <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={food.price}
                            onChange={(e) => handleChange(index, e)}
                            className={`w-full pl-8 pr-4 py-3 rounded-xl outline-none border transition-all font-medium ${theme.input}`}
                            required
                            min="0"
                            step="0.01"
                          />
                        </div>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => removeFood(index)}
                          disabled={foods.length === 1}
                          className={`p-3 rounded-xl transition-all ${
                            foods.length === 1 
                              ? 'opacity-0 cursor-default' 
                              : 'opacity-50 hover:opacity-100 text-red-500 hover:bg-red-500/10'
                          }`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Button */}
              <button
                type="button"
                onClick={addFood}
                className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] ${theme.buttonSecondary}`}
              >
                <Plus className="w-4 h-4" />
                Add Another Dish
              </button>

              {/* Divider */}
              <div className={`h-px w-full my-6 ${subs ? 'bg-white/10' : 'bg-gray-100'}`}></div>

              {/* Submit Section */}
              <div className="space-y-4">
                {isAllowed ? (
                  <div className={`p-4 rounded-xl flex items-start gap-3 ${subs ? 'bg-red-500/20 border border-red-500/30' : 'bg-red-50 border border-red-100'}`}>
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-red-600 dark:text-red-400 text-sm">Menu Already Exists</h4>
                      <p className={`text-xs mt-1 ${subs ? 'text-red-300' : 'text-red-500'}`}>
                        You have already uploaded a menu for this day. Please go to your profile to edit existing items.
                      </p>
                    </div>
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 active:scale-[0.98] ${theme.buttonPrimary} ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent" />
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Publish Menu
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Footer / CTA Section */}
        <div className="mt-8">
          {subs ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Star, text: "Top Placement" },
                { icon: Zap, text: "Instant Analytics" },
                { icon: Search, text: "SEO Boosted" }
              ].map((feature, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex items-center gap-3 text-purple-100 text-sm">
                  <feature.icon className="w-4 h-4 text-yellow-400" />
                  {feature.text}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  Want more visibility?
                </h4>
                <p className="text-sm text-gray-500 mt-1">Premium menus get 3x more views.</p>
              </div>
              <button 
                onClick={() => navigate("/subscription")}
                className="px-6 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                Upgrade Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default FoodForm;