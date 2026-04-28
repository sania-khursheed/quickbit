import { motion } from 'motion/react';
import { Target, Users, Landmark, UtensilsCrossed } from 'lucide-react';

export default function About() {
  const team = [
    { name: 'Marcus Chef', role: 'Executive Chef', image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=600' },
    { name: 'Elena Baker', role: 'Pastry Specialist', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=600' },
    { name: 'David Grill', role: 'Grill Master', image: 'https://images.unsplash.com/photo-1595273670150-db0a3d39074f?auto=format&fit=crop&q=80&w=600' },
  ];

  return (
    <div className="bg-white pb-24">
      {/* Header */}
      <section className="bg-black text-white py-32 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex justify-center mb-8">
            <UtensilsCrossed className="h-16 w-16 text-red-600" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter">OUR STORY</h1>
          <p className="text-xl text-gray-400 font-light leading-relaxed">
            From a small street kart in New York to a global fast-food phenomenon, our journey has always been about one thing: The Perfect Bite.
          </p>
        </motion.div>
      </section>

      {/* Story, Mission & Team - Bento Grid Style */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 auto-rows-min">
            
            {/* Main Story - Wide Bento */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="md:col-span-8 bg-white p-10 md:p-14 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-center"
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">Our Journey</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight">Redefining Fast Food Excellence.</h2>
              <p className="text-slate-500 text-lg leading-relaxed font-medium opacity-80 mb-6">
                Founded in 1998, QuickBite Express began as a small family-run kitchen with a single mission: to prove that "fast" doesn't have to mean "compromised." We've spent nearly three decades perfecting the art of the 15-minute gourmet meal.
              </p>
              <div className="flex items-center gap-4 pt-6 border-t border-slate-50 text-slate-400">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-slate-${200 + i*100}`}></div>)}
                </div>
                <p className="text-sm font-bold">Join 50k+ daily happy customers</p>
              </div>
            </motion.div>

            {/* Mission - Tall Bento */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="md:col-span-4 bg-red-600 p-10 md:p-12 rounded-[3rem] text-white flex flex-col justify-center shadow-2xl shadow-red-100 relative overflow-hidden group"
            >
              <div className="relative z-10">
                <Target className="h-12 w-12 mb-8 opacity-50 bg-white/20 p-2 rounded-xl" />
                <h3 className="text-3xl font-bold mb-4 tracking-tight">Our Mission</h3>
                <p className="text-white/80 font-medium leading-relaxed mb-8">
                  To serve high-quality, artisanal fast food that brings a smile to every face, delivered with speed that matches the pace of modern life.
                </p>
                <div className="w-12 h-1 bg-white/30"></div>
              </div>
              <UtensilsCrossed className="absolute -bottom-10 -right-10 h-48 w-48 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-700" />
            </motion.div>

            {/* Experience Counter - Small Bento */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="md:col-span-4 bg-slate-900 text-white p-8 rounded-[3rem] flex flex-col items-center justify-center text-center shadow-xl shadow-slate-900/10"
            >
              <span className="text-7xl font-black mb-2 text-red-500">25+</span>
              <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">Years of Experience</span>
            </motion.div>

            {/* Vision - Medium Bento */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="md:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-center"
            >
               <div className="w-20 h-20 bg-slate-50 flex items-center justify-center rounded-3xl shrink-0">
                  <Landmark className="h-10 w-10 text-slate-800" />
               </div>
               <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">The Vision</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">
                    To become the world's most trusted gourmet fast-food brand, known for our commitment to sustainability, local communities, and uncompromising taste.
                  </p>
               </div>
            </motion.div>

            {/* Team Section Title */}
            <div className="col-span-full pt-16 pb-8 px-4">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Our Master Craftsmen</h2>
              <p className="text-slate-500 font-medium">The experts behind every perfect bite.</p>
            </div>

            {/* Team - Bento Trio */}
            {team.map((member, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="md:col-span-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="w-full h-64 bg-slate-100 rounded-[2rem] mb-6 overflow-hidden relative">
                  <img src={member.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h4>
                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-4 opacity-70 leading-none">{member.role}</p>
                <p className="text-slate-500 text-sm font-medium opacity-80 leading-relaxed">The culinary expert ensuring perfection in every order.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
