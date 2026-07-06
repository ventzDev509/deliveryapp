import { motion } from 'framer-motion';
import { Eye, MoreVertical, ArrowUpRight } from 'lucide-react';

// Done Egzanp
const ordersData = [
  {
    id: "#ORD-9482",
    customer: "Jean-Baptiste R.",
    email: "jbr@email.com",
    avatar: "JR",
    date: "04 Jiyè 2026",
    amount: "$45.50",
    status: "Delivered",
  },
  {
    id: "#ORD-9481",
    customer: "Marlene Casimir",
    email: "marlene@email.com",
    avatar: "MC",
    date: "04 Jiyè 2026",
    amount: "$120.00",
    status: "Pending",
  },
  {
    id: "#ORD-9480",
    customer: "Woody Ventz",
    email: "ventz@dev.com",
    avatar: "WV",
    date: "03 Jiyè 2026",
    amount: "$15.00",
    status: "Cancelled",
  },
  {
    id: "#ORD-9479",
    customer: "Sonia Désir",
    email: "sonia@email.com",
    avatar: "SD",
    date: "02 Jiyè 2026",
    amount: "$62.20",
    status: "Delivered",
  },
];

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'Delivered':
      return 'bg-green-50 text-green-700 border-green-100 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20';
    case 'Pending':
      return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
    case 'Cancelled':
      return 'bg-red-50 text-red-700 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20';
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
      className="w-full bg-white rounded-3xl p-6 border border-gray-300 hadow-sm overflow-hidden dark:bg-zinc-950 dark:border-zinc-800 transition-colors duration-300"
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

      {/* Kontenè Table */}
      <div className="w-full overflow-x-auto whitespace-nowrap scrollbar-none">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50 text-gray-400 text-xs font-semibold uppercase tracking-wider dark:border-zinc-700 dark:text-zinc-500">
              <th className="pb-4 font-medium pr-4">ID Kòmand</th>
              <th className="pb-4 font-medium pr-4">Kliyan</th>
              <th className="pb-4 font-medium pr-4">Dat</th>
              <th className="pb-4 font-medium pr-4">Montan</th>
              {/* Redui espas padding-right sou Estati pou l pi pre Aksyon */}
              <th className="pb-4 font-medium pr-2">Estati</th>
              <th className="pb-4 font-medium text-right pl-2">Aksyon</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50/60 dark:divide-zinc-900">
            {ordersData.map((order, index) => (
              <tr key={index} className="hover:bg-gray-50/40 transition-colors duration-200 dark:hover:bg-zinc-900/30">
                {/* ID */}
                <td className="py-3.5 text-sm font-semibold text-gray-900 pr-4 dark:text-zinc-100">{order.id}</td>
                
                {/* User Info */}
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs flex-shrink-0 dark:bg-orange-500/10 dark:border-orange-500/20 dark:text-orange-400">
                      {order.avatar}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 dark:text-zinc-100">{order.customer}</span>
                      <span className="text-xs text-gray-400 font-normal dark:text-zinc-500">{order.email}</span>
                    </div>
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
                    {order.status === 'Delivered' ? 'Livre' : order.status === 'Pending' ? 'Annatant' : 'Anile'}
                  </span>
                </td>

                {/* Actions (Toujou visible, espas redui via pl-2) */}
                <td className="py-3.5 text-right pl-2">
                  <div className="inline-flex items-center gap-1 bg-gray-50/80 p-1 rounded-xl border border-gray-100 dark:bg-zinc-900 dark:border-zinc-800">
                    <button className="p-1.5 hover:bg-white rounded-lg text-gray-500 hover:text-orange-500 transition-all active:scale-95 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-orange-400">
                      <Eye size={15} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all active:scale-95 dark:text-zinc-500 dark:hover:text-zinc-300 dark:hover:bg-zinc-800">
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