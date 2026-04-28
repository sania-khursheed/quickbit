import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Utensils, Star, ArrowUpRight, Filter } from 'lucide-react';
import api from '../services/api';

interface FoodItem {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
}

export default function Menu() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Burgers', 'Pizza', 'Sides', 'Drinks', 'Desserts'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/food');
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredItems = items.filter(item => {
    const matchesFilter = filter === 'All' || item.category === filter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                         item.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans">
      {/* Menu Header */}
      <section className="bg-slate-900 text-white pt-24 pb-32 px-6 rounded-b-[4rem] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-600 via-transparent to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-[10px] font-black uppercase tracking-[0.4em] text-red-500 mb-6"
          >
            Artisanal Selection
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
          >
            The <span className="italic font-serif font-light">Gourmet</span> Menu.
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-slate-400 text-lg font-medium max-w-2xl mx-auto opacity-80"
          >
            Explore our curated collection of premium fast food, crafted with local ingredients and global flavors.
          </motion.p>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        <div className="bg-white p-4 md:p-6 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 w-full relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-red-500 transition-colors" />
            <input 
              type="text"
              placeholder="Search for flavors..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 font-medium outline-none focus:ring-2 focus:ring-red-500/20 focus:bg-white transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto invisible-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  filter === cat 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-200' 
                  : 'bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Grid - Bento Trio Pattern */}
      <section className="max-w-7xl mx-auto px-6 mt-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-40">
             <div className="w-16 h-16 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
             <p className="font-bold tracking-widest uppercase text-xs">Prepping Kitchen...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group bg-white p-6 rounded-[3rem] border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all flex flex-col"
                >
                  <div className="relative h-72 rounded-[2.5rem] overflow-hidden mb-6 shadow-sm">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-5 left-5">
                       <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-red-600 uppercase tracking-widest shadow-lg">
                        {item.category}
                       </span>
                    </div>
                    <div className="absolute bottom-5 right-5 bg-slate-900 text-white px-4 py-2 rounded-2xl font-bold shadow-xl tabular-nums">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3 px-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight group-hover:text-red-600 transition-colors">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-[10px] font-black text-amber-600">NEW</span>
                      </div>
                    </div>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-8 px-2">
                    <button className="w-full bg-slate-50 text-slate-900 font-bold py-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 group/btn">
                      Order for Pickup <ArrowUpRight className="h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredItems.length === 0 && (
              <div className="col-span-full text-center py-24 bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
                <Utensils className="h-16 w-16 text-slate-200 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No items found</h3>
                <p className="text-slate-400 font-medium">Try matching different cravings or check other categories.</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Trust Banner */}
      <section className="max-w-7xl mx-auto px-6 mt-32">
        <div className="bg-red-600 p-12 md:p-16 rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative shadow-2xl shadow-red-100">
           <div className="relative z-10 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Feeling Hungry?</h2>
              <p className="text-white/80 text-lg font-medium max-w-md">Our kitchens are open and ready to serve the most delicious fast food in the city.</p>
           </div>
           <div className="relative z-10 shrink-0">
              <button className="px-10 py-5 bg-white text-red-600 font-bold rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-2xl">
                 Order on UberEats
              </button>
           </div>
           <Utensils className="absolute -bottom-10 -left-10 h-64 w-64 text-white opacity-10 rotate-12" />
        </div>
      </section>
    </div>
  );
}
