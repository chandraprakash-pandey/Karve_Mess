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

  // --- Theme Configuration ---
  const theme = subs ? {
    mode: 'premium',
    bg: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
    card: 'bg-white/10 backdrop-blur-md border border-yellow-500/30 shadow-[0_0_40px_rgba(234,179,8,0.15)]',
    text: 'text-white',
    subText: 'text-purple-200',
    input: 'bg-black/20 border-white/10 text-white placeholder-white/40 focus:border-yellow-400 focus:ring-yellow-400/20',
    buttonPrimary: 'bg-gradient-to-r from-yellow-400 to-amber-600 hover:from-yellow-300 hover:to-amber-500 text-black shadow-yellow-900/20',
    buttonSecondary: 'bg-white/5 hover:bg-white/10 text-yellow-100 border border-white/10',
    badge: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50',
    dangerCard: 'bg-red-900/20 border border-red-500/30'
  } : {
    mode: 'standard',
    bg: 'bg-gradient-to-br from-orange-50 via-amber-50 to-red-50',
    card: 'bg-white border border-orange-100 shadow-xl',
    text: 'text-gray-800',
    subText: 'text-gray-500',
    input: 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20',
    buttonPrimary: 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white shadow-orange-500/20',
    buttonSecondary: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200',
    badge: 'bg-orange-100 text-orange-700 border border-orange-200',
    dangerCard: 'bg-white border border-red-100 shadow-lg'
  };

  // --- Effects ---
  useEffect(() => {
    axios.get("http://localhost:8000/user", { withCredentials: true })
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
    axios.get(`http://localhost:8000/editItem/${itemId}`, { withCredentials: true })
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
    axios.delete(`http://localhost:8000/editItem/${itemId}`, { withCredentials: true })
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

    axios.patch(`http://localhost:8000/editItem/${itemId}`, payload, { withCredentials: true })
      .then(() => navigate("/Menu"))
      .catch(err => console.error(err))
      .finally(() => setIsSubmitting(false));
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
      
      <div className="max-w-3xl mx-auto pt-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate("/Menu")}
          className={`mb-6 flex items-center gap-2 text-sm font-medium transition-colors ${subs ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Menu
        </button>

        {/* Premium Badge */}
        {subs && (
          <div className="flex justify-center mb-8 animate-fade-in-down">
            <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-xl px-6 py-2 rounded-full border border-yellow-500/30 shadow-xl">
              <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-200 to-amber-400 font-bold tracking-wide uppercase text-sm">
                Premium Editor
              </span>
            </div>
          </div>
        )}

        {/* Main Edit Card */}
        <div className={`rounded-3xl overflow-hidden transition-all duration-300 ${theme.card}`}>
          
          {/* Header */}
          <div className="p-8 pb-0 text-center">
             <h2 className={`text-3xl font-bold mb-2 flex items-center justify-center gap-3 ${theme.text}`}>
               Edit Menu Items
               {subs && <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />}
             </h2>
             <p className={`${theme.subText} text-sm font-medium uppercase tracking-wider`}>
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
                    className={`group relative flex items-start gap-3 p-2 rounded-xl transition-all duration-200 ${subs ? 'hover:bg-white/5' : 'hover:bg-orange-50/50'}`}
                  >
                    {/* Number Badge */}
                    <div className="pt-3 pl-1">
                       <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${theme.badge}`}>
                         {index + 1}
                       </span>
                    </div>

                    {/* Input Fields */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      
                      {/* Name */}
                      <div className="sm:col-span-2 relative">
                        <UtensilsCrossed className={`absolute left-4 top-3.5 w-4 h-4 ${theme.subText} opacity-50`} />
                        <input
                          type="text"
                          name="name"
                          placeholder="Dish Name"
                          value={food.name}
                          onChange={(e) => handleChange(index, e)}
                          className={`w-full pl-10 pr-4 py-3 rounded-xl outline-none border transition-all font-medium ${theme.input}`}
                          required
                        />
                      </div>

                      {/* Price & Delete */}
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

                        {/* Delete Row Button */}
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

              {/* Add More Button */}
              <button
                type="button"
                onClick={addFood}
                className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] ${theme.buttonSecondary}`}
              >
                <Plus className="w-4 h-4" />
                Add Another Variation
              </button>

              {/* Submit Button */}
              <div className={`pt-4 border-t ${subs ? 'border-white/10' : 'border-gray-100'}`}>
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
                      Save Changes
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* Danger Zone / Delete Section */}
        <div className={`mt-8 rounded-3xl p-6 sm:p-8 transition-all ${theme.dangerCard}`}>
           <div className="flex items-start gap-4">
             <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400">
               <AlertTriangle className="w-6 h-6" />
             </div>
             <div className="flex-1">
               <h3 className={`text-lg font-bold ${subs ? 'text-white' : 'text-gray-900'}`}>
                 Delete Entire Menu
               </h3>
               <p className={`text-sm mt-1 mb-4 ${subs ? 'text-gray-400' : 'text-gray-500'}`}>
                 Permanently remove this menu and all its items. This action cannot be undone.
               </p>
               
               {!showDeleteConfirm ? (
                 <button
                   onClick={() => setShowDeleteConfirm(true)}
                   className="px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm transition-colors border border-red-200"
                 >
                   Delete Menu
                 </button>
               ) : (
                 <div className="animate-fade-in flex items-center gap-3 flex-wrap">
                    <button
                      onClick={deleteItem}
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-md transition-colors"
                    >
                      Yes, Confirm Delete
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${subs ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
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
          <div className="mt-6 flex justify-center gap-6 text-xs text-purple-300/60 font-medium uppercase tracking-widest">
             <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Instant Sync</span>
             <span className="flex items-center gap-1"><Crown className="w-3 h-3" /> Priority Support</span>
          </div>
        )}

      </div>
    </div>
  );
}

export default EditItem;