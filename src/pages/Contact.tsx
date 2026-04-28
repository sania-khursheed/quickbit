import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Twitter } from 'lucide-react';
import { useState, FormEvent } from 'react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-black text-white py-32 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter">GET IN TOUCH</h1>
        <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
          Have a question or feedback? We'd love to hear from you. Our team is available 24/7.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Info */}
          <div>
            <h2 className="text-4xl font-black text-black mb-12 uppercase tracking-tight">CONTACT <span className="text-red-600">DETAILS</span></h2>
            <div className="space-y-12">
              <div className="flex items-start gap-6">
                <div className="bg-red-600 p-4 shrink-0 shadow-lg shadow-red-600/20">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Our Location</h3>
                  <p className="text-xl font-bold text-black border-b-2 border-black pb-1 inline-block">123 Fast Food St, NY 10001</p>
                  <p className="mt-2 text-gray-500 font-light">Gourmet Heights, Manhattan District</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-black p-4 shrink-0 shadow-lg shadow-black/20">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Phone Lines</h3>
                  <p className="text-xl font-bold text-black">+1 (555) 123-4567</p>
                  <p className="mt-2 text-gray-500 font-light">Available 9am - 10pm daily</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-red-600 p-4 shrink-0 shadow-lg shadow-red-600/20">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Direct Mail</h3>
                  <p className="text-xl font-bold text-black">hello@quickbite.com</p>
                  <p className="mt-2 text-gray-500 font-light">We reply within 2 hours</p>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-16 border-t border-gray-100">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Follow Us</h3>
              <div className="flex gap-4">
                {[Facebook, Twitter, Instagram].map((Icon, i) => (
                  <a key={i} href="#" className="p-4 border-2 border-black text-black hover:bg-black hover:text-white transition-all transform hover:-translate-y-1">
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-gray-50 p-10 md:p-16 border-2 border-black relative">
            <div className="absolute -top-4 -right-4 bg-red-600 text-white p-2">
              <Utensils className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-black text-black mb-8 uppercase tracking-tight">SEND A MESSAGE</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">FullName</label>
                <input
                  required
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-white border-2 border-transparent border-b-black px-4 py-3 focus:outline-none focus:border-red-600 transition-colors font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                <input
                  required
                  type="email"
                  placeholder="john@example.com"
                  className="w-full bg-white border-2 border-transparent border-b-black px-4 py-3 focus:outline-none focus:border-red-600 transition-colors font-medium"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Your Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we help?"
                  className="w-full bg-white border-2 border-transparent border-b-black px-4 py-3 focus:outline-none focus:border-red-600 transition-colors font-medium resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-5 bg-black text-white font-bold uppercase tracking-widest hover:bg-red-600 transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                Send Message <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-24 h-[500px] w-full bg-gray-200 grayscale contrast-125 border-4 border-black group overflow-hidden relative">
          <div className="absolute inset-0 bg-red-600/10 group-hover:bg-transparent transition-colors z-10 pointer-events-none"></div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.9147703055!2d-74.11976373946229!3d40.69740344223377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1675718237244!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </div>
  );
}

function Utensils(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );
}
