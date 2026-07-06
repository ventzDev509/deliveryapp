import { motion } from 'framer-motion';
import { Eye, MoreVertical, ArrowUpRight, Bike, Clock } from 'lucide-react';

// Done Egzanp ak Griot, Bannann ak chofè yo
const ordersData = [
  {
    id: "#ORD-9482",
    customer: "Jean-Baptiste R.",
    email: "jbr@email.com",
    avatar: "JR",
    items: "1x Griot ak Bannann, 1x Jus Sitwon",
    type: "Delivery",
    driver: "Marius K. (Chofè)",
    date: "04 Jiyè 2026",
    amount: "$45.50",
    status: "New",
  },
  {
    id: "#ORD-9481",
    customer: "Marlene Casimir",
    email: "marlene@email.com",
    avatar: "MC",
    items: "2x Diri Kole ak Poul Sòs",
    type: "Delivery",
    driver: "Tandans Chofè",
    date: "04 Jiyè 2026",
    amount: "$120.00",
    status: "Preparing",
  },
  {
    id: "#ORD-9480",
    customer: "Woody Ventz",
    email: "ventz@dev.com",
    avatar: "WV",
    items: "1x Combo Burger Pwason",
    type: "Pickup",
    driver: "Kliyan an ap vini",
    date: "03 Jiyè 2026",
    amount: "$15.00",
    status: "Dispatched",
  },
  {
    id: "#ORD-9479",
    customer: "Sonia Désir",
    email: "sonia@email.com",
    avatar: "SD",
    items: "3x Griot ak Bannann Peze",
    type: "Delivery",
    driver: "Marius K. (Chofè)",
    date: "02 Jiyè 2026",
    amount: "$135.00",
    status: "Delivered",
  },
];

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'New':
      return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
    case 'Preparing':
      return 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20';
    case 'Dispatched':
      return 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20';
    case 'Delivered':
      return 'bg-green-50 text-green-700 border-green-100 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-100 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700';
  }
};

const RecentOrdersTable = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="w-full bg-white rounded-3xl p-6 border border-gray-200 shadow-sm overflow-hidden dark:bg-zinc-950 dark:border-zinc-800 transition-colors duration-300"
    >
      {/* Tèt Tab la */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight dark:text-zinc-50">Dènye Kòmand yo</h2>
          <p className="text-xs text-gray-400 mt-0.5 dark:text-zinc-500">Jere ak verifye dènye lavant magazen an fè.</p>
        </div>
        <button className="text-xs font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors dark:text-orange-400 dark:hover:text-orange-300">
          Tout kòmand <ArrowUpRight size={14} />
        </button>
      </div>

      {/* 🔥 Kontenè Table la ki pran background gri a kounye a */}
      <div className="w-full overflow-x-auto whitespace-nowrap scrollbar-none rounded-2xl bg-gray-50/70 p-2 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-400 text-xs font-semibold uppercase tracking-wider dark:text-zinc-500">
              <th className="pb-4 pt-3 pl-4 font-medium pr-4">ID Kòmand</th>
              <th className="pb-4 pt-3 font-medium pr-4">Kliyan / Detay</th>
              <th className="pb-4 pt-3 font-medium pr-4">Livre Via</th>
              <th className="pb-4 pt-3 font-medium pr-4">Dat</th>
              <th className="pb-4 pt-3 font-medium pr-4">Montan</th>
              <th className="pb-4 pt-3 font-medium pr-2">Estati</th>
              <th className="pb-4 pt-3 font-medium text-right pr-4 pl-2">Aksyon</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/30 dark:divide-zinc-800/30">
            {ordersData.map((order, index) => (
              <tr 
                key={index} 
                className={`
                  transition-all duration-200 rounded-xl
                  ${index % 2 === 0 ? 'bg-white dark:bg-zinc-950/40' : 'bg-transparent'} 
                  hover:bg-white/80 dark:hover:bg-zinc-900/50 hover:shadow-sm
                `}
              >
                {/* ID */}
                <td className="py-3.5 pl-4 text-sm font-semibold text-gray-900 pr-4 dark:text-zinc-100">{order.id}</td>
                
                {/* User Info & Detay Manje a */}
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs flex-shrink-0 dark:bg-orange-500/10 dark:border-orange-500/20 dark:text-orange-400">
                      {order.avatar}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-gray-900 dark:text-zinc-100 truncate">{order.customer}</span>
                      <span className="text-xs text-gray-400 font-normal dark:text-zinc-400 truncate mt-0.5 max-w-[180px]">
                        {order.items} <span className="text-gray-300 dark:text-zinc-600 mx-1">•</span> {order.email}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Chofè / Tip Livrezon */}
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-zinc-300 font-medium">
                    {order.type === 'Delivery' ? <Bike size={13} className="text-orange-500" /> : <Clock size={13} className="text-blue-500" />}
                    <span className="truncate max-w-[130px]">{order.driver}</span>
                  </div>
                </td>

                {/* Date */}
                <td className="py-3.5 text-sm text-gray-500 pr-4 dark:text-zinc-400">{order.date}</td>

                {/* Amount */}
                <td className="py-3.5 text-sm font-bold text-gray-900 pr-4 dark:text-zinc-50">{order.amount}</td>

                {/* Status */}
                <td className="py-3.5 pr-2">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${getStatusStyles(order.status)}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
                    {order.status === 'New' && 'Nouvo'}
                    {order.status === 'Preparing' && 'Ap Kwit'}
                    {order.status === 'Dispatched' && 'En Route'}
                    {order.status === 'Delivered' && 'Livre'}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3.5 text-right pr-4 pl-2">
                  <div className="inline-flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-100 dark:bg-zinc-950 dark:border-zinc-800 shadow-sm">
                    <button className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-orange-500 transition-all active:scale-95 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-orange-400">
                      <Eye size={15} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all active:scale-95 dark:text-zinc-500 dark:hover:text-zinc-300 dark:hover:bg-zinc-800">
                      <MoreVertical size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default RecentOrdersTable;