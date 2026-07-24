import HoursRow from "../HoursRow";
import { motion } from 'framer-motion';

const springTransition = { type: "spring", stiffness: 200, damping: 25, mass: 0.8 } as const;

export default function HouseOfWork() {
    return <>
        <motion.div
            key="hours-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
        >
            <div className="mb-2">
                <h3 className="text-xs font-bold text-gray-800 dark:text-zinc-200">Orè Operasyon yo</h3>
                <p className="text-[11px] text-gray-400 dark:text-zinc-500">Aktive jou restoran an ap travay epi mete lè ouvèti/fèmti.</p>
            </div>

            <motion.div layout="position" transition={springTransition} className="space-y-2">
                <HoursRow day="Lendi" initialIsOpen={true} />
                <HoursRow day="Madi" initialIsOpen={true} />
                <HoursRow day="Mèkredi" initialIsOpen={true} />
                <HoursRow day="Jedi" initialIsOpen={true} />
                <HoursRow day="Venredi" initialIsOpen={true} />
                <HoursRow day="Samdi" initialIsOpen={true} />
                <HoursRow day="Dimanch" initialIsOpen={false} />
            </motion.div>
        </motion.div>
    </>
}