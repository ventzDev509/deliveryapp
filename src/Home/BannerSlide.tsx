import  { useState, useEffect } from 'react';

// Ou ka chanje lyen imaj sa yo ak pwòp imaj ou yo
const slides = [
    {
        id: 1,
        title: "Fresh & Delicious Food",
        subtitle: "Special Discount",
        discount: "Up to 50% OFF",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop",
    },
    {
        id: 2,
        title: "Super Fast Delivery",
        subtitle: "Hot & Spicy",
        discount: "Free Delivery Today",
        image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1000&auto=format&fit=crop",
    },
    {
        id: 3,
        title: "Best Quality Burgers",
        subtitle: "Weekend Special",
        discount: "Buy 1 Get 1 Free",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop",
    },
];

export default function BannerSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Chanje slide chak 4 segonn otomatikman
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-2 mt-4">
            <div className="relative w-full h-48 sm:h-60 md:h-72 rounded-3xl overflow-hidden bg-[#1e1e24] shadow-2xl border border-white/[0.04]">
                
                {/* Slides Container */}
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                    >
                        {/* Background Image ak Gradient Overlay pou tèks la ka klè */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#121214] via-[#121214]/80 to-transparent z-10" />
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
                        />

                        {/* Tèks ak Detay sou Banner la */}
                        <div className="relative z-20 h-full flex flex-col justify-center px-6 sm:px-10 max-w-lg">
                            <span className="text-amber-400 font-semibold text-xs sm:text-sm tracking-wider uppercase mb-1">
                                {slide.subtitle}
                            </span>
                            <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2">
                                {slide.title}
                            </h2>
                            <div className="inline-block bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm px-3 py-1.5 rounded-full w-fit shadow-md mb-4">
                                {slide.discount}
                            </div>
                            <button className="bg-white hover:bg-zinc-100 text-zinc-950 font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full w-fit transition-all shadow-lg active:scale-95">
                                Order Now
                            </button>
                        </div>
                    </div>
                ))}

                {/* Dot Navigation Indicators (Pwen pou montre ki slide ki aktif la) */}
                <div className="absolute bottom-3 right-5 z-30 flex items-center gap-1.5">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-2 rounded-full transition-all ${
                                index === currentSlide
                                    ? 'w-6 bg-amber-400'
                                    : 'w-2 bg-white/40 hover:bg-white/60'
                            }`}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
}