import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Plus, Trash2, UtensilsCrossed, Save, 
  AlertTriangle, Crown, Sparkles, Zap, 
  ArrowLeft, X 
} from "lucide-react";

function EditItem() {
  // --- State Management ---
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [foods, setFoods] = useState([{ name: "", price: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [subs, setSubs] = useState(false);
  const [loading, setLoading] = useState(true);

  const itemId = useParams().foodItemId;
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  // --- Effects ---
  useEffect(() => {
    axios.get(`${apiUrl}`, { withCredentials: true })
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
    axios.get(`${apiUrl}/editItem/${itemId}`, { withCredentials: true })
      .then(res => {
        // Convert object back to array for form handling
        setFoods(Object.entries(res.data.item).map(([name, price]) => ({ name, price })));
      })
      .catch(err => {
        console.error(err);
        navigate("/Menu");
      });
  }, [itemId, navigate]);

  // --- Handlers ---
  const addFood = () => setFoods([...foods, { name: "", price: "" }]);

  const removeFood = (index) => {
    if (foods.length > 1) {
      setFoods(foods.filter((_, i) => i !== index));
    }
  };

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFoods = [...foods];
    updatedFoods[index][name] = value;
    setFoods(updatedFoods);
  };

  const deleteItem = () => {
    axios.delete(`${apiUrl}/editItem/${itemId}`, { withCredentials: true })
      .then(() => navigate("/Menu"))
      .catch(err => console.error(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const itemsMap = {};
    foods.forEach(food => {
      if (food.name.trim() !== "") {
        itemsMap[food.name] = Number(food.price);
      }
    });

    const payload = { item: itemsMap };

    axios.patch(`${apiUrl}/editItem/${itemId}`, payload, { withCredentials: true })
      .then(() => navigate("/Menu"))
      .catch(err => console.error(err))
      .finally(() => setIsSubmitting(false));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dot-pattern pb-12 px-4 font-display">
      <div className="max-w-3xl mx-auto pt-8">
        
        

        {/* Premium Badge */}
        {subs && (
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-yellow-custom neo-border px-6 py-3 rounded-full shadow-neo">
              <Crown className="w-5 h-5 text-indigo-custom" />
              <span className="text-indigo-custom font-black tracking-wide uppercase text-sm">
                Premium Editor
              </span>
              <Sparkles className="w-5 h-5 text-primary wiggle" />
            </div>
          </div>
        )}

        {/* Main Edit Card */}
        <div className="bg-white neo-border rounded-3xl overflow-hidden shadow-neo-lg card-lifted">
          
          {/* Header */}
          <div className="p-8 pb-6 text-center bg-yellow-custom/20">
            <h2 className="text-4xl md:text-5xl font-black mb-3 text-indigo-custom uppercase tracking-tight flex items-center justify-center gap-3">
              <UtensilsCrossed className="w-10 h-10" />
              Edit Menu Items
            </h2>
            <p className="text-indigo-custom/70 font-bold uppercase tracking-wider text-sm">
              Update prices or add new variations
            </p>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-4">
                {foods.map((food, index) => (
                  <div 
                    key={index} 
                    className="group relative flex items-start gap-3 p-4 rounded-xl bg-background-light neo-border hover:bg-yellow-custom/30 transition-all duration-200"
                  >
                    {/* Number Badge */}
                    <div className="pt-3">
                      <span className="flex items-center justify-center w-10 h-10 rounded-full text-sm font-black bg-primary text-white neo-border shadow-neo">
                        {index + 1}
                      </span>
                    </div>

                    {/* Input Fields */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      
                      {/* Name */}
                      <div className="sm:col-span-2 relative">
                        <input
                          type="text"
                          name="name"
                          placeholder="Dish Name"
                          value={food.name}
                          onChange={(e) => handleChange(index, e)}
                          className="w-full px-4 py-3 rounded-xl outline-none neo-border bg-white text-indigo-custom placeholder-indigo-custom/40 font-bold focus:bg-yellow-custom/20 transition-all"
                          required
                        />
                      </div>

                      {/* Price & Delete */}
                      <div className="relative flex items-center gap-2">
                        <div className="relative w-full">
                          <span className="absolute left-4 top-3.5 text-lg font-black text-indigo-custom">₹</span>
                          <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={food.price}
                            onChange={(e) => handleChange(index, e)}
                            className="w-full pl-9 pr-4 py-3 rounded-xl outline-none neo-border bg-white text-indigo-custom placeholder-indigo-custom/40 font-bold focus:bg-yellow-custom/20 transition-all"
                            required
                            min="0"
                            step="0.01"
                          />
                        </div>

                        {/* Delete Row Button */}
                        <button
                          type="button"
                          onClick={() => removeFood(index)}
                          disabled={foods.length === 1}
                          className={`p-3 rounded-xl transition-all neo-border ${
                            foods.length === 1 
                              ? 'opacity-30 cursor-not-allowed bg-gray-100' 
                              : 'bg-white hover:bg-red-500 hover:text-white text-red-500 btn-lifted'
                          }`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add More Button */}
              <button
                type="button"
                onClick={addFood}
                className="w-full py-4 rounded-xl font-black flex items-center justify-center gap-2 transition-all bg-white neo-border btn-lifted text-indigo-custom uppercase tracking-wider hover:bg-yellow-custom"
              >
                <Plus className="w-5 h-5" />
                Add Another Variation
              </button>

              {/* Submit Button */}
              <div className="pt-6 border-t-3 border-indigo-custom">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-5 rounded-xl font-black text-xl shadow-neo-lg flex items-center justify-center gap-3 transition-all btn-lifted bg-primary text-white uppercase tracking-widest ${isSubmitting ? 'opacity-70 cursor-wait' : 'hover:bg-orange-600'}`}
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent" />
                  ) : (
                    <>
                      <Save className="w-6 h-6" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* Danger Zone / Delete Section */}
        <div className="mt-8 rounded-3xl p-6 sm:p-8 bg-white neo-border shadow-neo-lg">
          <div className="flex items-start gap-4">
            <div className="p-4 rounded-xl bg-red-100 text-red-600 neo-border shrink-0">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-black text-indigo-custom uppercase">
                Danger Zone
              </h3>
              <p className="text-sm mt-2 mb-5 text-indigo-custom/70 font-bold">
                Permanently remove this menu and all its items. This action cannot be undone.
              </p>
              
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-6 py-3 rounded-xl bg-red-100 hover:bg-red-500 hover:text-white text-red-600 font-black text-sm transition-all neo-border btn-lifted uppercase tracking-wider"
                >
                  Delete Menu
                </button>
              ) : (
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={deleteItem}
                    className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow-neo transition-all neo-border uppercase tracking-wider"
                  >
                    Yes, Confirm Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-6 py-3 rounded-xl font-black text-sm transition-all bg-white neo-border text-indigo-custom hover:bg-yellow-custom uppercase tracking-wider btn-lifted"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Premium Footer Info */}
        {subs && (
          <div className="mt-8 flex justify-center gap-8 text-xs text-indigo-custom/60 font-black uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" /> 
              Instant Sync
            </span>
            <span className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-primary" /> 
              Priority Support
            </span>
          </div>
        )}

      </div>

      <style jsx>{`
        .neo-border {
          border: 3px solid #312e81;
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
          transform: translate(4px, 4px);
          box-shadow: 0px 0px 0px 0px #312e81;
        }
        .card-lifted {
          transition: all 0.2s ease;
        }
        .card-lifted:hover {
          transform: translate(-4px, -4px);
          box-shadow: 12px 12px 0px 0px #312e81;
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
        .shadow-neo {
          box-shadow: 4px 4px 0px 0px #312e81;
        }
        .shadow-neo-lg {
          box-shadow: 8px 8px 0px 0px #312e81;
        }
        .border-t-3 {
          border-top-width: 3px;
        }
        .border-3 {
          border-width: 3px;
        }
        .font-display {
          font-family: system-ui, -apple-system, sans-serif;
        }
        
        @keyframes wiggle {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-5deg);
          }
          75% {
            transform: rotate(5deg);
          }
        }
        
        .wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default EditItem;