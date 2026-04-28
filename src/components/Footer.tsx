import { UtensilsCrossed, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-24 pb-8 rounded-t-[4rem]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-red-600 rounded-xl">
                <UtensilsCrossed className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">QUICK<span className="text-red-500">BITE</span></span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              Elevating the standard of fast-food through premium ingredients and artisanal craftsmanship since 1998.
            </p>
            <div className="flex space-x-3">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="p-2.5 bg-slate-800 rounded-xl hover:bg-red-600 hover:-translate-y-1 transition-all duration-300">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-8 text-red-500">Quick Links</h3>
            <ul className="space-y-4 text-slate-400 font-medium text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/menu" className="hover:text-white transition-colors">Menu</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-8 text-red-500">Operating Hours</h3>
            <ul className="space-y-4 text-slate-400 font-medium text-sm">
              <li className="flex justify-between"><span>Mon - Fri</span> <span className="text-white">09:00 - 22:00</span></li>
              <li className="flex justify-between"><span>Sat</span> <span className="text-white">10:00 - 23:00</span></li>
              <li className="flex justify-between"><span>Sun</span> <span className="text-white">10:00 - 22:00</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-8 text-red-500">Connect</h3>
            <ul className="space-y-6 text-slate-300 font-medium text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-red-600 shrink-0" />
                <span className="opacity-80">123 Fast Food Street, Gourmet City, NY 10001</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-red-600 shrink-0" />
                <span className="opacity-80">hello@quickbite.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          <p>© {new Date().getFullYear()} QuickBite Express • Crafted for Flavor</p>
        </div>
      </div>
    </footer>
  );
}
