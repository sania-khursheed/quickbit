import { useState, useEffect, FormEvent } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  ListOrdered, 
  LogOut, 
  Search, 
  Edit, 
  Trash2, 
  X,
  Plus,
  Package,
  Layers,
  UtensilsCrossed,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';

interface FoodItem {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
}

interface Stats {
  totalItems: number;
  totalCategories: number;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'stats' | 'add' | 'list'>('stats');
  const [items, setItems] = useState<FoodItem[]>([]);
  const [stats, setStats] = useState<Stats>({ totalItems: 0, totalCategories: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  
  const { logout, user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [itemsRes, statsRes] = await Promise.all([
        api.get('/food'),
        api.get('/stats')
      ]);
      setItems(itemsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/food/${id}`);
      toast.success('Item removed successfully');
      setItemToDelete(null);
      await fetchData();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const menuItems = [
    { id: 'stats', label: 'Stats', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'add', label: 'Add Food', icon: <PlusCircle className="h-5 w-5" /> },
    { id: 'list', label: 'Manage Food', icon: <ListOrdered className="h-5 w-5" /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 flex flex-col border-r border-slate-200">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20">
            <UtensilsCrossed className="h-6 w-6 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">QUICK<span className="text-red-500">BITE</span></span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 font-medium ${
                activeTab === item.id 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="w-5 h-5">{item.icon}</div>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[10px] text-white">
              {user?.email[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white font-bold truncate">{user?.email}</p>
              <button 
                onClick={logout}
                className="text-[10px] text-slate-500 hover:text-red-400 transition-colors underline cursor-pointer"
              >
                Logout Session
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {menuItems.find(i => i.id === activeTab)?.label} Management
            </h1>
            <p className="text-slate-500 text-sm mt-1">Monitor and update your live food catalog</p>
          </div>
          {activeTab !== 'add' && (
            <button 
              onClick={() => setActiveTab('add')}
              className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-red-200 hover:bg-red-700 transition-all flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add New Food Item
            </button>
          )}
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 min-h-0">
          <AnimatePresence mode="wait">
            {activeTab === 'stats' && <StatsView stats={stats} items={items} onEdit={(item: any) => setEditingItem(item)} onDelete={(id: number) => setItemToDelete(id)} />}
            {activeTab === 'add' && <AddFoodView onComplete={() => { setActiveTab('list'); fetchData(); }} />}
            {activeTab === 'list' && (
              <ListView 
                items={items} 
                search={search} 
                setSearch={setSearch} 
                onDelete={(id: number) => setItemToDelete(id)}
                onEdit={(item: any) => setEditingItem(item)}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Edit Modal */}
      {editingItem && (
        <EditModal 
          item={editingItem} 
          onClose={() => setEditingItem(null)} 
          onComplete={() => { setEditingItem(null); fetchData(); }} 
          onDelete={(id: number) => setItemToDelete(id)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <DeleteConfirmModal 
          onClose={() => setItemToDelete(null)}
          onConfirm={() => handleDelete(itemToDelete)}
        />
      )}
    </div>
  );
}

function DeleteConfirmModal({ onClose, onConfirm }: { onClose: () => void, onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-sm p-8 rounded-[2.5rem] shadow-2xl relative border border-slate-100 text-center"
      >
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Trash2 className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Remove from Kitchen?</h3>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">This action cannot be undone. This delicacy will be permanently deleted from the menu.</p>
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-4 bg-slate-50 text-slate-400 font-bold uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 py-4 bg-red-600 text-white font-bold uppercase tracking-widest text-[10px] rounded-2xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all"
          >
            Delete Item
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function StatsView({ stats, items, onEdit, onDelete }: { stats: Stats, items: FoodItem[], onEdit: (item: FoodItem) => void, onDelete: (id: number) => void }) {
  const featuredItem = items[0];
  const recentItems = items.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-3 gap-5 h-full"
    >
      {/* Stat 1: Total Items */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-none">Total Items</p>
        <h3 className="text-5xl font-black text-slate-900 leading-none">{stats.totalItems}</h3>
        <div className="text-xs text-emerald-500 font-bold border-t border-slate-50 pt-3">+12% this month</div>
      </div>

      {/* Stat 2: Active Categories */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-none">Categories</p>
        <h3 className="text-5xl font-black text-slate-900 leading-none">{stats.totalCategories}</h3>
        <div className="flex gap-1 border-t border-slate-50 pt-3">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <div className="w-2 h-2 rounded-full bg-slate-200"></div>
          <div className="w-2 h-2 rounded-full bg-slate-200"></div>
        </div>
      </div>

      {/* Featured Item Card (Bento span) */}
      <div className="lg:col-span-2 lg:row-span-2 bg-slate-900 rounded-3xl relative overflow-hidden group min-h-[400px]">
        {featuredItem ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 transition-opacity group-hover:opacity-80"></div>
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('${featuredItem.imageUrl}')` }}></div>
            <div className="absolute bottom-0 p-8 z-20 w-full">
              <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full mb-4 inline-block uppercase tracking-widest shadow-lg shadow-red-600/20">NEWEST ADDITION</span>
              <h2 className="text-4xl font-bold text-white leading-tight mb-4 tracking-tight">{featuredItem.name}</h2>
              <div className="flex justify-between items-center bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <p className="text-white text-xl font-bold">${featuredItem.price.toFixed(2)}</p>
                <div className="flex gap-2">
                  <button onClick={() => onEdit(featuredItem)} className="px-5 py-2.5 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors">Edit</button>
                  <button onClick={() => onDelete(featuredItem.id)} className="px-5 py-2.5 bg-red-600 rounded-xl text-white text-xs font-bold hover:bg-red-700 transition-colors">Delete</button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm font-medium">No items yet</div>
        )}
      </div>

      {/* Recent Entries Table (Bento span) */}
      <div className="lg:col-span-2 lg:row-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <h4 className="text-lg font-bold text-slate-900 tracking-tight">Recent Menu Entries</h4>
          <span className="text-xs text-slate-400 font-medium">Last 3 items added</span>
        </div>
        <div className="space-y-4 flex-1">
          {recentItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <img src={item.imageUrl} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{item.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{item.category}</p>
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-1">
                <p className="text-sm font-black text-slate-900">${item.price.toFixed(2)}</p>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(item)} className="text-[10px] text-blue-600 font-bold hover:underline">EDIT</button>
                  <button onClick={() => onDelete(item.id)} className="text-[10px] text-red-600 font-bold hover:underline">DELETE</button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-slate-400 text-center py-10 italic">Your catalog is currently empty</p>}
        </div>
      </div>

      {/* Bottom Mini Bento Items */}
      <div className="bg-red-50 rounded-3xl p-8 border border-red-100 shadow-sm flex flex-col justify-center">
        <p className="text-red-800 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Live Status</p>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <h3 className="text-3xl font-bold text-red-600 tracking-tight leading-none uppercase">UPDATING</h3>
        </div>
        <p className="text-[10px] text-red-400 mt-4 font-medium uppercase">Syncing with database</p>
      </div>
      <div className="bg-slate-100 rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-center">
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Data Source</p>
        <div className="flex items-center gap-3">
          <Layers className="h-6 w-6 text-slate-800" />
          <h3 className="text-3xl font-bold text-slate-800 tracking-tight leading-none">SQLITE</h3>
        </div>
        <p className="text-[10px] text-slate-400 mt-4 font-medium uppercase tracking-wider">Local Persistence</p>
      </div>
    </motion.div>
  );
}

function AddFoodView({ onComplete }: { onComplete: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: '',
    category: ''
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/food', {
        ...formData,
        price: parseFloat(formData.price)
      });
      toast.success('Food item added to the menu!');
      onComplete();
    } catch (error) {
      toast.error('Failed to add food item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl bg-white p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block ml-2">Food Name</label>
            <input
              required
              placeholder="e.g. Double Bacon Blaze"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none font-medium"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block ml-2">Price ($)</label>
            <input
              required
              type="number"
              step="0.01"
              placeholder="12.99"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none font-medium"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block ml-2">Category</label>
          <select
            required
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none font-medium appearance-none"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option value="">Select Category</option>
            <option value="Burgers">Burgers</option>
            <option value="Pizza">Pizza</option>
            <option value="Sides">Sides</option>
            <option value="Drinks">Drinks</option>
            <option value="Desserts">Desserts</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block ml-2">Image URL</label>
          <div className="relative group">
             <input
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none font-mono text-sm"
              placeholder="https://images.unsplash.com/..."
              value={formData.imageUrl}
              onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block ml-2">Short Description</label>
          <textarea
            required
            rows={3}
            placeholder="Tell us why this item is a must-have..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none font-medium resize-none"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-slate-900 text-white font-bold uppercase tracking-widest py-5 rounded-2xl hover:bg-red-600 transition-all flex items-center justify-center gap-3 shadow-lg shadow-slate-200 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><PlusCircle className="h-5 w-5" /> Add Food to Menu</>}
        </button>
      </form>
    </motion.div>
  );
}

function ListView({ items, search, setSearch, onDelete, onEdit }: any) {
  const filtered = items.filter((i: any) => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 h-6 w-6 group-focus-within:text-red-500 transition-colors" />
        <input 
          className="w-full bg-white border border-slate-200 rounded-3xl p-6 pl-16 font-medium outline-none text-lg shadow-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-slate-300"
          placeholder="Filter your delicious catalog..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((item: any) => (
          <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-5 hover:shadow-xl hover:shadow-slate-200/50 transition-all group border-b-4 border-b-transparent hover:border-b-red-600">
            <div className="h-48 bg-slate-100 rounded-2xl overflow-hidden relative">
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-slate-900 shadow-sm tabular-nums">
                ${item.price.toFixed(2)}
              </div>
            </div>
            <div className="flex-grow space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-600 block mb-1">{item.category}</span>
                  <h4 className="font-bold text-slate-900 text-xl tracking-tight leading-none group-hover:text-red-600 transition-colors">{item.name}</h4>
                </div>
              </div>
              <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed opacity-80">{item.description}</p>
            </div>
            <div className="flex gap-2 pt-2 border-t border-slate-50">
              <button 
                onClick={() => onEdit(item)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-900 rounded-xl hover:bg-slate-900 hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
              >
                <Edit className="h-3 w-3" /> Edit
              </button>
              <button 
                onClick={() => onDelete(item.id)}
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-slate-100 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all text-xs font-bold uppercase tracking-widest"
              >
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">No results found for your search</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function EditModal({ item, onClose, onComplete, onDelete }: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: item.name,
    price: item.price.toString(),
    description: item.description,
    imageUrl: item.imageUrl,
    category: item.category
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/food/${item.id}`, {
        ...formData,
        price: parseFloat(formData.price)
      });
      toast.success('Gourmet details updated!');
      onComplete();
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-2xl p-10 rounded-[2.5rem] shadow-2xl relative border border-slate-100"
      >
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors p-2 hover:bg-slate-50 rounded-full">
          <X className="h-6 w-6"/>
        </button>
        <h2 className="text-3xl font-black text-slate-900 uppercase mb-8 tracking-tighter">Edit <span className="text-red-600">{item.name}</span></h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block ml-2">Food Name</label>
              <input
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none font-bold"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block ml-2">Price ($)</label>
              <input
                required
                type="number"
                step="0.01"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none font-bold"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block ml-2">Category</label>
            <select
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none font-bold appearance-none"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="Burgers">Burgers</option>
              <option value="Pizza">Pizza</option>
              <option value="Sides">Sides</option>
              <option value="Drinks">Drinks</option>
              <option value="Desserts">Desserts</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block ml-2">Description</label>
            <textarea
              required
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none font-medium resize-none shadow-inner"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex gap-4">
            <button
              disabled={loading}
              type="submit"
              className="flex-3 bg-slate-900 text-white font-bold uppercase tracking-widest py-5 rounded-2xl hover:bg-red-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'SAVE CHANGES'}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                onClose();
                onDelete(item.id);
              }}
              className="flex-1 bg-white border border-slate-200 text-slate-400 font-bold uppercase tracking-widest py-5 rounded-2xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all flex items-center justify-center"
              title="Delete Item"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
