import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
    const [searchQuery, setSearchQuery] = useState<string>('');

    return (
        <>
            <header className="sticky top-0 z-50 bg-[#121214]/90 backdrop-blur-md text-white border-b border-gray-600/5 transition-all">
                <div className="max-w-7xl mx-auto px-5 pt-4 pb-4">

                    {/* TOP SECTION */}
                    <div className="flex justify-between items-center">

                        {/* LOCATION */}
                        <div className="group cursor-pointer">
                            <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
                                <svg
                                    className="w-3.5 h-3.5 text-amber-400"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                <span>Location</span>
                            </div>

                            <div className="mt-0.5 flex items-center gap-1.5 font-semibold text-[15px] text-zinc-100 group-hover:text-amber-400 transition-colors">
                                <span>Al Safa Street, Al Wasi</span>
                                <svg
                                    className="w-4 h-4 text-zinc-400"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* CART BUTTON */}
                        <Link
                            to="/cart"
                            className="relative h-12 w-12 rounded-full bg-[#1e1e24] hover:bg-[#272730] border border-white/[0.06] flex items-center justify-center transition-all shadow-lg active:scale-95"
                        >
                            <svg
                                className="w-5 h-5 text-zinc-200"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>

                            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-400 text-zinc-950 text-[10px] font-black flex items-center justify-center shadow-md">
                                2
                            </span>
                        </Link>
                    </div>

                    {/* SEARCH & FILTER SECTION */}
                    <div className="mt-4 flex gap-3">

                        {/* SEARCH INPUT */}
                        <div className="flex-1 relative">
                            <svg
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>

                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search dishes, restaurants..."
                                className="
                                    w-full
                                    h-12
                                    rounded-full
                                    bg-[#1e1e24]
                                    border
                                    border-white/[0.04]
                                    pl-11
                                    pr-4
                                    text-sm
                                    text-zinc-100
                                    placeholder:text-zinc-500
                                    outline-none
                                    focus:border-amber-400/50
                                    transition-all
                                "
                            />
                        </div>

                        {/* FILTER BUTTON */}
                        <button className="h-12 pl-4 pr-2 rounded-full bg-[#1e1e24] hover:bg-[#272730] border border-white/[0.04] flex items-center gap-3 transition-all group">
                            <span className="text-sm font-medium text-zinc-200">
                                Filter
                            </span>

                            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center group-hover:scale-105 transition-transform">
                                <svg
                                    className="w-4 h-4 text-zinc-950"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 6h16M7 12h10M10 18h4"
                                    />
                                </svg>
                            </div>
                        </button>

                    </div>

                </div>
            </header>

            {/* MOBILE BOTTOM NAVIGATION BAR - Fòse l an nwa ak bg-[#121214] */}
            <nav className="bottom-nav md:hidden fixed bottom-0 left-0 right-0 bg-[#121214] backdrop-blur-lg border-t border-white/[0.08] px-6 py-2.5 z-50 flex justify-between items-center shadow-2xl">
                <Link to="/" className="flex flex-col items-center text-amber-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                    <span className="text-[10px] font-semibold mt-1">Home</span>
                </Link>

                <Link to="/orders" className="flex flex-col items-center text-zinc-400 hover:text-amber-400 transition-colors">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                    <span className="text-[10px] font-medium mt-1">Orders</span>
                </Link>

                <Link to="/payment" className="flex flex-col items-center text-zinc-400 hover:text-amber-400 transition-colors">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                    </svg>
                    <span className="text-[10px] font-medium mt-1">Payment</span>
                </Link>

                <Link to="/profile" className="flex flex-col items-center text-zinc-400 hover:text-amber-400 transition-colors">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span className="text-[10px] font-medium mt-1">Profile</span>
                </Link>
            </nav>
        </>
    );
}