import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
    const [searchQuery, setSearchQuery] = useState<string>('');

    return (
        <>
            <header className="
                sticky top-0 z-50
                bg-white/90 dark:bg-[#121214]/90
                backdrop-blur-md
                text-zinc-900 dark:text-white
                border-b border-gray-200 dark:border-gray-600/5
                transition-all
            ">
                <div className="max-w-7xl mx-auto px-5 pt-4 pb-4">

                    {/* TOP SECTION */}
                    <div className="flex justify-between items-center">

                        {/* LOCATION */}
                        <div className="group cursor-pointer">

                            <div className="
                                flex items-center gap-1.5
                                text-[11px]
                                font-medium
                                tracking-wide
                                text-zinc-500 dark:text-zinc-400
                                uppercase
                            ">
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


                            <div className="
                                mt-0.5
                                flex items-center gap-1.5
                                font-semibold
                                text-[15px]
                                text-zinc-900 dark:text-zinc-100
                                group-hover:text-amber-400
                                transition-colors
                            ">
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


                        {/* CART */}
                        <Link
                            to="/cart"
                            className="
                                relative
                                h-12 w-12
                                rounded-full
                                bg-zinc-100 dark:bg-[#1e1e24]
                                hover:bg-zinc-200 dark:hover:bg-[#272730]
                                border border-gray-200 dark:border-white/[0.06]
                                flex items-center justify-center
                                transition-all
                                shadow-lg
                                active:scale-95
                            "
                        >

                            <svg
                                className="w-5 h-5 text-zinc-700 dark:text-zinc-200"
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


                            <span className="
                                absolute
                                -top-1
                                -right-1
                                h-5 w-5
                                rounded-full
                                bg-amber-400
                                text-zinc-950
                                text-[10px]
                                font-black
                                flex items-center justify-center
                                shadow-md
                            ">
                                2
                            </span>

                        </Link>

                    </div>


                    {/* SEARCH */}
                    <div className="mt-4 flex gap-3">

                        <div className="flex-1 relative">

                            <svg
                                className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    w-4 h-4
                                    text-zinc-400
                                "
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
                                onChange={(e)=>setSearchQuery(e.target.value)}
                                placeholder="Search dishes, restaurants..."
                                className="
                                    w-full
                                    h-12
                                    rounded-full
                                    bg-zinc-100 dark:bg-[#1e1e24]
                                    border border-gray-200 dark:border-white/[0.04]
                                    pl-11
                                    pr-4
                                    text-sm
                                    text-zinc-900 dark:text-zinc-100
                                    placeholder:text-zinc-500
                                    outline-none
                                    focus:border-amber-400/50
                                    transition-all
                                "
                            />

                        </div>


                        {/* FILTER */}
                        <button
                            className="
                                h-12
                                pl-4
                                pr-2
                                rounded-full
                                bg-zinc-100 dark:bg-[#1e1e24]
                                hover:bg-zinc-200 dark:hover:bg-[#272730]
                                border border-gray-200 dark:border-white/[0.04]
                                flex items-center gap-3
                                transition-all
                            "
                        >

                            <span className="
                                text-sm
                                font-medium
                                text-zinc-700 dark:text-zinc-200
                            ">
                                Filter
                            </span>


                            <div className="
                                h-8 w-8
                                rounded-full
                                bg-white
                                flex items-center justify-center
                            ">
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



            {/* BOTTOM NAV */}
            <nav className="
                bottom-nav
                md:hidden
                fixed
                bottom-0
                left-0
                right-0

                bg-white dark:bg-[#121214]

                backdrop-blur-lg

                border-t
                border-gray-200 dark:border-white/[0.08]

                px-6
                py-2.5

                z-50

                flex
                justify-between
                items-center

                shadow-2xl
            ">


                <Link to="/" className="flex flex-col items-center text-amber-400">
                    <span>⌂</span>
                    <span className="text-[10px] font-semibold mt-1">
                        Home
                    </span>
                </Link>


                <Link 
                    to="/orders"
                    className="
                    flex flex-col items-center
                    text-zinc-500 dark:text-zinc-400
                    hover:text-amber-400
                    "
                >
                    <span>▣</span>
                    <span className="text-[10px] mt-1">
                        Orders
                    </span>
                </Link>


                <Link
                    to="/payment"
                    className="
                    flex flex-col items-center
                    text-zinc-500 dark:text-zinc-400
                    hover:text-amber-400
                    "
                >
                    <span>▤</span>
                    <span className="text-[10px] mt-1">
                        Payment
                    </span>
                </Link>


                <Link
                    to="/profile"
                    className="
                    flex flex-col items-center
                    text-zinc-500 dark:text-zinc-400
                    hover:text-amber-400
                    "
                >
                    <span>◯</span>
                    <span className="text-[10px] mt-1">
                        Profile
                    </span>
                </Link>


            </nav>

        </>
    );
}