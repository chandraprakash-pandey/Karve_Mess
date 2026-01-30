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
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
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

  // --- Effects ---
  useEffect(() => {
    axios.get(`${apiUrl}/user`, { withCredentials: true })
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
    axios.get(`${apiUrl}/myItems`, { withCredentials: true })
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

    axios.post(`${apiUrl}/fooditems`, { chefId: user._id, item: itemsMap, day }, { withCredentials: true })
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
      <div className="min-h-screen flex items-center justify-center bg-background-light dot-pattern">
        <div className="w-16 h-16 border-4 border-indigo-custom border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 px-4 bg-background-light dot-pattern font-display">
      {/* Premium Navigation Component */}
      {subs && <Days />}

      <div className="max-w-3xl mx-auto pt-8">
        {/* Premium Header Badge */}
        {subs && (
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-yellow-custom neo-border px-6 py-3 rounded-full shadow-neo">
              <Crown className="w-5 h-5 text-indigo-custom fill-indigo-custom stroke-[2.5]" />
              <span className="text-indigo-custom font-black tracking-wide uppercase text-sm">
                Premium Chef Dashboard
              </span>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white neo-border rounded-2xl overflow-hidden shadow-neo-lg">
          
          {/* Card Header */}
          <div className="p-8 pb-0 text-center">
            <div className={`mx-auto w-20 h-20 rounded-2xl neo-border flex items-center justify-center mb-6 shadow-neo rotate-tilt ${subs ? 'bg-yellow-custom' : 'bg-primary'}`}>
              <ChefHat className="w-10 h-10 text-white stroke-[2.5]" />
            </div>
            
            <h2 className="text-4xl font-black mb-2 text-indigo-custom uppercase tracking-tight">
              {subs ? "Curate Your Menu" : "Add Today's Menu"}
            </h2>
            <p className="text-indigo-custom/70 text-sm font-bold uppercase tracking-wider">
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
                    className="group relative flex items-start gap-3 p-3 rounded-xl hover:bg-yellow-custom/10 transition-all duration-200"
                  >
                    {/* Count Badge */}
                    <div className="pt-3 pl-1">
                       <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-black neo-border shadow-neo-sm ${subs ? 'bg-yellow-custom text-indigo-custom' : 'bg-primary text-white'}`}>
                         {index + 1}
                       </span>
                    </div>

                    {/* Inputs Container */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      
                      {/* Name Input */}
                      <div className="sm:col-span-2 relative">
                        <UtensilsCrossed className="absolute left-4 top-3.5 w-5 h-5 text-indigo-custom/50 stroke-[2.5]" />
                        <input
                          type="text"
                          name="name"
                          placeholder="Dish Name (e.g., Butter Chicken)"
                          value={food.name}
                          onChange={(e) => handleChange(index, e)}
                          className="w-full pl-12 pr-4 py-3 rounded-xl outline-none border-3 border-indigo-custom bg-white focus:border-primary transition-all font-medium text-indigo-custom placeholder-indigo-custom/40"
                          required
                        />
                      </div>

                      {/* Price Input */}
                      <div className="relative flex items-center gap-2">
                        <div className="relative w-full">
                          <span className="absolute left-4 top-3.5 text-sm font-black text-indigo-custom/70">₹</span>
                          <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={food.price}
                            onChange={(e) => handleChange(index, e)}
                            className="w-full pl-8 pr-4 py-3 rounded-xl outline-none border-3 border-indigo-custom bg-white focus:border-primary transition-all font-medium text-indigo-custom placeholder-indigo-custom/40"
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
                          className={`btn-lifted p-3 rounded-xl neo-border bg-white transition-all ${
                            foods.length === 1 
                              ? 'opacity-0 cursor-default' 
                              : 'hover:bg-red-500 hover:text-white text-red-500 shadow-neo'
                          }`}
                        >
                          <Trash2 className="w-5 h-5 stroke-[2.5]" />
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
                className="btn-lifted w-full py-4 rounded-xl font-black flex items-center justify-center gap-2 transition-all bg-white neo-border text-indigo-custom hover:bg-yellow-custom shadow-neo uppercase tracking-wide"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
                Add Another Dish
              </button>

              {/* Divider */}
              <div className="h-1 w-full my-6 bg-indigo-custom/10 rounded-full"></div>

              {/* Submit Section */}
              <div className="space-y-4">
                {isAllowed ? (
                  <div className="p-5 rounded-xl flex items-start gap-3 bg-red-50 neo-border border-red-500">
                    <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5 stroke-[2.5]" />
                    <div>
                      <h4 className="font-black text-red-600 text-sm uppercase">Menu Already Exists</h4>
                      <p className="text-sm mt-1 text-red-500 font-medium">
                        You have already uploaded a menu for this day. Please go to your profile to edit existing items.
                      </p>
                    </div>
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn-lifted w-full py-5 rounded-xl font-black text-lg shadow-neo-lg flex items-center justify-center gap-3 transition-all uppercase tracking-widest ${subs ? 'bg-yellow-custom text-indigo-custom hover:bg-primary hover:text-white' : 'bg-primary text-white hover:bg-indigo-custom'} neo-border ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-3 border-current border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Save className="w-6 h-6 stroke-[2.5]" />
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
                <div key={i} className="bg-white neo-border rounded-xl p-4 flex items-center gap-3 text-indigo-custom font-bold text-sm shadow-neo">
                  <feature.icon className="w-5 h-5 text-yellow-custom stroke-[2.5]" />
                  {feature.text}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white neo-border rounded-2xl p-6 shadow-neo flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-black text-indigo-custom flex items-center gap-2 uppercase">
                  <Sparkles className="w-5 h-5 text-primary stroke-[2.5]" />
                  Want more visibility?
                </h4>
                <p className="text-sm text-indigo-custom/70 mt-1 font-medium">Premium menus get 3x more views.</p>
              </div>
              <button 
                onClick={() => navigate("/subscription")}
                className="btn-lifted px-6 py-3 bg-primary text-white text-sm font-black rounded-xl hover:bg-yellow-custom hover:text-indigo-custom transition-all flex items-center gap-2 neo-border shadow-neo uppercase tracking-wide whitespace-nowrap"
              >
                Upgrade Now <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>

      </div>

      <style jsx>{`
        .neo-border {
          border: 3px solid #312e81;
        }
        .border-3 {
          border-width: 3px;
        }
        .dot-pattern {
          background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .btn-lifted {
          transition: all 0.2s ease;
          box-shadow: 4px 4px 0px 0px #312e81;
        }
        .btn-lifted:hover {
          transform: translate(2px, 2px);
          box-shadow: 0px 0px 0px 0px #312e81;
        }
        .btn-lifted:active {
          transform: translate(2px, 2px);
          box-shadow: 0px 0px 0px 0px #312e81;
        }
        .bg-primary {
          background-color: #f87116;
        }
        .text-primary {
          color: #f87116;
        }
        .bg-indigo-custom {
          background-color: #312e81;
        }
        .text-indigo-custom {
          color: #312e81;
        }
        .bg-yellow-custom {
          background-color: #facc15;
        }
        .text-yellow-custom {
          color: #facc15;
        }
        .bg-background-light {
          background-color: #fffdf5;
        }
        .shadow-neo-sm {
          box-shadow: 2px 2px 0px 0px #312e81;
        }
        .shadow-neo {
          box-shadow: 4px 4px 0px 0px #312e81;
        }
        .shadow-neo-lg {
          box-shadow: 8px 8px 0px 0px #312e81;
        }
        .font-display {
          font-family: system-ui, -apple-system, sans-serif;
        }
        
        /* Animations */
        @keyframes rotate-tilt {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(3deg);
          }
        }
        
        .rotate-tilt {
          animation: rotate-tilt 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default FoodForm;