import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Eye, ArrowRight, Bike, Clock, AlertCircle } from 'lucide-react';

// 1. Tipaj TypeScript pou done yo ka solid
type OrderStatus = 'New' | 'Preparing' | 'Dispatched' | 'Delivered';

interface Order {
  id: string;
  customer: string;
  items: string;
  type: 'Delivery' | 'Pickup';
  driver: string;
  payment: string;
  amount: string;
  status: OrderStatus;
  time: string;
  minutesElapsed: number;
}

const initialOrders: Order[] = [
  {
    id: "#ORD-9482",
    customer: "Jean-Baptiste R.",
    items: "1x Griot ak Bannann, 1x Jus Sitwon",
    type: "Delivery",
    driver: "Marius K. (Chofè)",
    payment: "MonCash",
    amount: "$45.50",
    status: "New",
    time: "Sa gen 3 min",
    minutesElapsed: 3
  },
  {
    id: "#ORD-9481",
    customer: "Marlene Casimir",
    items: "2x Diri Kole ak Poul Sòs",
    type: "Delivery",
    driver: "Tandans Chofè",
    payment: "Cash on Delivery",
    amount: "$120.00",
    status: "Preparing",
    time: "Sa gen 18 min",
    minutesElapsed: 18
  },
  {
    id: "#ORD-9480",
    customer: "Woody Ventz",
    items: "1x Combo Burger Pwason",
    type: "Pickup",
    driver: "Kliyan an ap vini",
    payment: "Card",
    amount: "$15.00",
    status: "Dispatched",
    time: "Sa gen 25 min",
    minutesElapsed: 25
  },
  {
    id: "#ORD-9479",
    customer: "Sonia Désir",
    items: "3x Griot ak Bannann Peze",
    type: "Delivery",
    driver: "Marius K. (Chofè)",
    payment: "MonCash",
    amount: "$135.00",
    status: "Delivered",
    time: "Jodi a, 11:30 AM",
    minutesElapsed: 120
  }
];

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 🔥 FONKSYON KI CHANJE ESTATI KÒMAND LAN LÈ OU KLIKE
  const handleNextStatus = (orderId: string, currentStatus: OrderStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id !== orderId) return order;
        
        let nextStatus: OrderStatus = currentStatus;
        if (currentStatus === 'New') nextStatus = 'Preparing';
        else if (currentStatus === 'Preparing') nextStatus = 'Dispatched';
        else if (currentStatus === 'Dispatched') nextStatus = 'Delivered';

        return { ...order, status: nextStatus };
      })
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'All' || order.status === activeTab;
    const matchesSearch = order.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'New': return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50';
      case 'Preparing': return 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900/50';
      case 'Dispatched': return 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/50';
      case 'Delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50';
      default: return 'bg-gray-50 text-gray-700 border-gray-100 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700';
    }
  };

  const getTimeAlertStyles = (minutes: number, status: OrderStatus) => {
    if (status === 'Delivered') return { textClass: 'text-gray-400 dark:text-zinc-500', isCritical: false };

    if ((status === 'New' && minutes >= 10) || (status === 'Preparing' && minutes >= 15)) {
      return { 
        textClass: 'text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-100 animate-pulse dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50', 
        isCritical: true 
      };
    }
    
    if (status === 'Preparing' && minutes >= 10) {
      return { textClass: 'text-amber-600 dark:text-amber-400 font-semibold', isCritical: false };
    }

    return { textClass: 'text-gray-400 dark:text-zinc-400 font-medium', isCritical: false };
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* 1. TÈT PAJ LA & SEARCH */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-zinc-50 tracking-tight">Kòmand yo</h1>
          <p className="text-xs text-gray-400 dark:text-zinc-400 mt-0.5">Swiv, prepare, epi jere livrezon yo an tan reyèl.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500" size={16} />
            <input 
              type="text" 
              placeholder="Chache ID, non kliyan..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl text-xs font-medium text-gray-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-colors shadow-sm"
            />
          </div>
          <button className="p-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl text-gray-500 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-500 transition-colors shadow-sm">
            <Filter size={16} />
          </button>
        </div>
      </motion.div>

      {/* 2. TABS FILTRE */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-gray-100 dark:border-zinc-800"
      >
        {[
          { id: 'All', label: 'Tout', count: orders.length },
          { id: 'New', label: 'Nouvo', count: orders.filter(o => o.status === 'New').length },
          { id: 'Preparing', label: 'Ap Kwit', count: orders.filter(o => o.status === 'Preparing').length },
          { id: 'Dispatched', label: 'En Route', count: orders.filter(o => o.status === 'Dispatched').length },
          { id: 'Delivered', label: 'Livre', count: orders.filter(o => o.status === 'Delivered').length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.id 
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/10' 
                : 'bg-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800'
            }`}
          >
            {tab.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-black ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </motion.div>

      {/* 3. LIS KÒMAND YO */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="w-full bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm"
      >
        <div className="w-full overflow-x-auto whitespace-nowrap scrollbar-none">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800 text-gray-400 dark:text-zinc-500 text-[11px] font-bold uppercase tracking-wider bg-gray-50/40 dark:bg-zinc-800/20">
                <th className="p-4 pl-6">Kòmand</th>
                <th className="p-4">Kliyan / Detay</th>
                <th className="p-4">Livre Via</th>
                <th className="p-4">Peman</th>
                <th className="p-4">Montan</th>
                <th className="p-4">Estati</th>
                <th className="p-4 text-right pr-6">Aksyon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/60 dark:divide-zinc-800/60">
              <AnimatePresence mode="popLayout">
                {filteredOrders.map((order) => {
                  const timeAlert = getTimeAlertStyles(order.minutesElapsed, order.status);

                  return (
                    <motion.tr 
                      key={order.id}
                      layout
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      className={`hover:bg-gray-50/30 dark:hover:bg-zinc-800/20 transition-colors ${timeAlert.isCritical ? 'bg-rose-50/10 dark:bg-rose-950/5' : ''}`}
                    >
                      
                      {/* ID & LÈ */}
                      <td className="p-4 pl-6">
                        <div className="flex flex-col items-start">
                          <span className="text-xs font-black text-gray-900 dark:text-zinc-100">{order.id}</span>
                          <span className={`text-[10px] mt-1 flex items-center gap-1 transition-all ${timeAlert.textClass}`}>
                            {timeAlert.isCritical ? <AlertCircle size={10} className="text-rose-600 dark:text-rose-400" /> : <Clock size={10} />}
                            {order.time}
                          </span>
                        </div>
                      </td>

                      {/* KLIYAN AK MANJE A */}
                      <td className="p-4 max-w-[220px]">
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-gray-900 dark:text-zinc-100 truncate">{order.customer}</span>
                          <span className="text-[11px] text-gray-500 dark:text-zinc-400 truncate mt-0.5 font-medium">{order.items}</span>
                        </div>
                      </td>

                      {/* CHOFÈ / TIP */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-zinc-300 font-medium">
                          {order.type === 'Delivery' ? <Bike size={13} className="text-orange-500" /> : <Clock size={13} className="text-blue-500" />}
                          <span>{order.driver}</span>
                        </div>
                      </td>

                      {/* KALITE PEMAN */}
                      <td className="p-4 text-xs font-bold text-gray-700 dark:text-zinc-300">{order.payment}</td>

                      {/* MONTAN */}
                      <td className="p-4 text-xs font-black text-gray-900 dark:text-zinc-100">{order.amount}</td>

                      {/* BADJ ESTATI */}
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold border ${getStatusBadge(order.status)}`}>
                          {order.status === 'New' && 'Nouvo'}
                          {order.status === 'Preparing' && 'Ap Kwit'}
                          {order.status === 'Dispatched' && 'En Route'}
                          {order.status === 'Delivered' && 'Livre'}
                        </span>
                      </td>

                      {/* AKSYON RAPID */}
                      <td className="p-4 text-right pr-6">
                        <div className="inline-flex items-center gap-1">
                          <button className="p-2 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 border border-gray-100 dark:border-zinc-700 rounded-xl text-gray-500 dark:text-zinc-400 transition-colors active:scale-95">
                            <Eye size={13} />
                          </button>

                          {order.status !== 'Delivered' && (
                            <button 
                              onClick={() => handleNextStatus(order.id, order.status)}
                              className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs flex items-center gap-1 transition-all shadow-sm shadow-orange-500/10 active:scale-95 pl-3 pr-2.5"
                            >
                              <span>
                                {order.status === 'New' && 'Ap Kwit'}
                                {order.status === 'Preparing' && 'Livre Chofè'}
                                {order.status === 'Dispatched' && 'Fèmen'}
                              </span>
                              <ArrowRight size={12} />
                            </button>
                          )}
                        </div>
                      </td>

                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
          
          {/* Si pa gen kòmand nan filtre a */}
          <AnimatePresence>
            {filteredOrders.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-12 text-center flex flex-col items-center justify-center"
              >
                <span className="text-2xl">🍽️</span>
                <h3 className="text-xs font-bold text-gray-700 dark:text-zinc-300 mt-2">Pa gen okenn kòmand konsa</h3>
                <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-0.5">Eseye chanje filtre a oswa rechèch ou an.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default OrdersPage;