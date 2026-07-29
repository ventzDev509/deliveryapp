import { Link } from 'react-router-dom';

interface RestaurantProps {
    id: string;
    name: string;
    image: string;
    cuisine: string;
    rating: number;
    deliveryTime: string;
    priceRange?: string;
}

export default function PopularRestaurantCard({
    id,
    name,
    image,
    cuisine,
    rating,
    deliveryTime,
    priceRange = "$$"
}: RestaurantProps) {
    return (
        <Link 
            to={`/restaurant/${id}`} 
            className="group block bg-[#1e1e24] border border-white/[0.04] rounded-2xl overflow-hidden hover:border-amber-400/40 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98]"
        >
            {/* IMAJ AK BADJ */}
            <div className="relative h-44 w-full overflow-hidden bg-zinc-800">
                <img 
                    src={image} 
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay gradyan pou rèvèrs tèks oswa ikon yo parèt byen */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e24] via-transparent to-black/30" />

                {/* Rating Badj */}
                <div className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1 shadow-md">
                    <svg className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-xs font-bold text-zinc-100">{rating}</span>
                </div>

                {/* Tag Popular anba adwat sou imaj la (Opsyonèl) */}
                <span className="absolute bottom-3 left-3 bg-amber-400 text-zinc-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Popular
                </span>
            </div>

            {/* ENFÒMASYON RESTORAN AN */}
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <h3 className="text-base font-bold text-zinc-100 group-hover:text-amber-400 transition-colors line-clamp-1">
                        {name}
                    </h3>
                    <span className="text-xs font-semibold text-zinc-400">{priceRange}</span>
                </div>

                <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
                    {cuisine}
                </p>

                {/* DETAY (Tan livrezon ak distans) */}
                <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs text-zinc-400">
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium text-zinc-300">{deliveryTime}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400 font-semibold group-hover:translate-x-1 transition-transform">
                        <span>Wè meni</span>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    );
}