import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, Clock, ShieldCheck, Utensils, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface FoodItem {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
}

export default function Home() {
  const [popularItems, setPopularItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await api.get('/food');
        setPopularItems(response.data.slice(0, 6)); // Show first 6 as popular
      } catch (error) {
        console.error('Error fetching food:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFood();
  }, []);

  const features = [
    { icon: <Clock className="h-8 w-8 text-red-600" />, title: 'Fast Delivery', desc: 'Get your food delivered in under 30 minutes, guaranteed.' },
    { icon: <ShieldCheck className="h-8 w-8 text-red-600" />, title: 'Quality Food', desc: 'We use the freshest ingredients from local organic farms.' },
    { icon: <Utensils className="h-8 w-8 text-red-600" />, title: 'Expert Chefs', desc: 'Our chefs have years of experience in gourmet fast food.' },
  ];

  const testimonials = [
    { name: 'John Doe', text: 'Best burgers I have ever tasted! The spice level is just perfect.', rating: 5 },
    { name: 'Sarah Wilson', text: 'Fast delivery and the food was still piping hot. Highly recommended!', rating: 5 },
    { name: 'Mike Johnson', text: 'The admin dashboard feature is super cool for managing their menu.', rating: 4 },
  ];

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Main Hero Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-8 bg-slate-900 rounded-[3rem] p-10 md:p-16 relative overflow-hidden flex flex-col justify-center min-h-[500px]"
            >
              <div className="absolute inset-0 opacity-20">
                <img
                  src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=1920"
                  alt="Hero Background"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10">
                <span className="inline-block px-4 py-1.5 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-8 shadow-lg shadow-red-600/20">
                  ESTD. 2026
                </span>
                <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-8 tracking-tight">
                  Crafting the <span className="text-red-500">Perfect</span><br />Fast-Food Story.
                </h1>
                <p className="text-lg text-slate-300 mb-10 leading-relaxed font-medium max-w-xl opacity-80">
                  Experience the bold fusion of gourmet ingredients and lightning-speed service. Every bite is an obsession.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/menu"
                    className="px-8 py-4 bg-red-600 text-white font-bold rounded-2xl flex items-center gap-2 group hover:bg-red-700 transition-all shadow-xl shadow-red-600/10"
                  >
                    Explore Menu <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/contact"
                    className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/10 font-bold rounded-2xl hover:bg-white/20 transition-all"
                  >
                    Locate Us
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Side Hero Bento Items */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex-1 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-center items-center text-center group transition-all hover:scale-[1.02]"
              >
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 text-red-600 shadow-inner group-hover:rotate-12 transition-transform">
                  <Clock className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Fastest in Town</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">Under 20 min delivery within the city limits.</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex-1 bg-red-600 rounded-[2.5rem] p-10 text-white shadow-xl shadow-red-100 flex flex-col justify-center overflow-hidden relative group"
              >
                <div className="relative z-10">
                  <h3 className="text-4xl font-bold mb-2 leading-none">4.9/5</h3>
                  <div className="flex gap-1 mb-4 text-white/50">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-white text-white" />)}
                  </div>
                  <p className="text-white/80 text-sm font-medium">Over 50K+ happy eaters across the country.</p>
                </div>
                <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <Utensils className="h-32 w-32 rotate-12" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Items - Bento Grid */}
      <section className="py-24 bg-white rounded-[4rem] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16 px-4">
            <div>
              <p className="text-[10px] font-bold text-red-600 uppercase tracking-[0.3em] mb-3">Live Menu</p>
              <h2 className="text-5xl font-bold text-slate-900 tracking-tight">Crowd Favorites</h2>
            </div>
            <Link to="/menu" className="text-slate-900 font-bold flex items-center gap-2 hover:text-red-600 transition-colors tracking-tight">
              Full Catalogue <ArrowUpRight className="h-5 w-5" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularItems.length > 0 ? (
                popularItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all"
                  >
                    <div className="relative h-64 overflow-hidden rounded-[2rem] mb-6 shadow-md">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-slate-900 font-bold shadow-lg tabular-nums">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="space-y-3 px-2">
                      <span className="text-red-600 text-[10px] font-bold uppercase tracking-[0.2em]">{item.category}</span>
                      <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{item.name}</h3>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2 opacity-70">{item.description}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold">Your kitchen is currently preparing. Check back soon!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Bento */}
      <section className="py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-16">
          <h2 className="text-5xl font-bold text-slate-900 tracking-tight mb-4">Love from Every Corner</h2>
          <p className="text-slate-500 font-medium">Real reviews from our community of food lovers.</p>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-slate-900 rounded-[3rem] p-12 text-white flex flex-col justify-between shadow-2xl shadow-slate-900/10">
             <div className="flex gap-1 mb-8">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-red-600 text-red-600" />)}
             </div>
             <p className="text-3xl font-medium leading-tight mb-12 tracking-tight">"The Double Bacon Blaze is literally life-changing. I have never had a burger with such perfect texture and heat. It's my Saturday ritual!"</p>
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-400">JD</div>
                <div>
                   <p className="font-bold">Jonathan Doe</p>
                   <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Food Enthusiast</p>
                </div>
             </div>
          </div>
          <div className="lg:col-span-5 grid grid-rows-2 gap-8">
             <div className="bg-red-600 rounded-[3rem] p-10 text-white shadow-xl shadow-red-100 flex flex-col justify-center">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-white text-white opacity-40" />)}
                </div>
                <p className="text-xl font-bold tracking-tight mb-4 leading-tight">"Hot food, cold drinks, and 15-minute delivery. What more could you ask for? Pure perfection!"</p>
                <p className="text-sm font-medium opacity-60 italic">— Sarah W.</p>
             </div>
             <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-center">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 fill-red-600 text-red-600 ${i < 4 ? '' : 'opacity-20'}`} />)}
                </div>
                <p className="text-xl font-bold tracking-tight mb-4 text-slate-900 leading-tight">"The online dashboard is so smooth to navigate. Ordering is a breeze!"</p>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-tight">— Mike J.</p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
