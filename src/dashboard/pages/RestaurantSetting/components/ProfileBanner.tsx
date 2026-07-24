import { Camera, ShieldCheck } from "lucide-react";


export default function ProfileBanner(){
    return<>
    <div className="relative rounded-3xl overflow-hidden border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                {/* Banner */}
                <div className="h-32 md:h-44 bg-gradient-to-r from-orange-400 to-amber-500 relative group">
                    <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px]" />
                    <button className="absolute right-4 top-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white transition-all text-xs font-bold flex items-center gap-1.5 opacity-0 group-hover:opacity-100">
                        <Camera size={14} />
                        <span className="hidden sm:inline">Chanje Banner</span>
                    </button>
                </div>

                {/* Pwofil rapid anba Banner la */}
                <div className="px-6 pb-6 pt-12 md:pt-14 relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Ti kare Logo a ki monte sou Banner la */}
                    <div className="absolute -top-12 left-6 w-24 h-24 rounded-2xl border-4 border-white dark:border-zinc-900 bg-gray-100 dark:bg-zinc-800 shadow-md overflow-hidden group">
                        <img
                            src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=200"
                            alt="Logo"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity">
                            <Camera size={16} />
                        </div>
                    </div>

                    <div>
                        <h2 className="text-base font-black text-gray-900 dark:text-zinc-100 flex items-center gap-1.5">
                            { "Non Restoran an"}
                            <ShieldCheck size={16} className="text-emerald-500 dark:text-emerald-400 fill-emerald-50 dark:fill-emerald-950/30" />
                        </h2>
                        <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium">{ "Pa gen adrès fiks"}</p>
                    </div>
                </div>
            </div>
    </>
}