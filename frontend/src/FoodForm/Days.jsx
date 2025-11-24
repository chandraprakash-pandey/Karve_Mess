import React, { useEffect, useRef } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';

function Days() {
    const days = [
        { name: 'sunday', short: 'Sun' },
        { name: 'monday', short: 'Mon' },
        { name: 'tuesday', short: 'Tue' },
        { name: 'wednesday', short: 'Wed' },
        { name: 'thursday', short: 'Thu' },
        { name: 'friday', short: 'Fri' },
        { name: 'saturday', short: 'Sat' }
    ];
    
    const [searchParams] = useSearchParams();
    const currentDay = searchParams.get('day');
    const scrollRef = useRef(null);

    // Auto-scroll to active item on mobile
    useEffect(() => {
        if (scrollRef.current) {
            const activeElement = scrollRef.current.querySelector('[data-active="true"]');
            if (activeElement) {
                activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    }, [currentDay]);

    return (
        <div className="w-full bg-slate-950 relative overflow-hidden border-b border-white/10 shadow-2xl">
            {/* Background Decor (Glow effects) */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <nav 
                    ref={scrollRef}
                    className="
                        flex items-center gap-3 py-6 
                        overflow-x-auto snap-x snap-mandatory
                        scrollbar-hide 
                        /* Desktop: Center items, Mobile: Start align */
                        md:justify-center justify-start
                    "
                    style={{ 
                        // Hides scrollbar for Firefox/IE/Edge
                        msOverflowStyle: 'none', 
                        scrollbarWidth: 'none' 
                    }}
                >
                    {/* CSS to hide scrollbar for Webkit (Chrome/Safari) */}
                    <style>{`
                        nav::-webkit-scrollbar { display: none; }
                    `}</style>

                    {days.map((day) => {
                        const isActive = currentDay === day.name.toLowerCase();
                        
                        return (
                            <NavLink
                                key={day.name}
                                to={`?day=${day.name.toLowerCase()}`}
                                data-active={isActive}
                                className="group relative shrink-0 snap-center"
                            >
                                <div className={`
                                    relative px-6 py-3 rounded-2xl 
                                    font-medium text-sm transition-all duration-300 ease-out
                                    border backdrop-blur-md
                                    flex flex-col items-center justify-center
                                    min-w-20 sm:min-w-[100px]
                                    ${isActive 
                                        ? 'bg-violet-600/90 border-violet-400/50 text-white shadow-[0_0_20px_rgba(124,58,237,0.5)] scale-105 -translate-y-0.5' 
                                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white hover:border-white/20'
                                    }
                                `}>
                                    {/* Mobile Text (Short) */}
                                    <span className="block sm:hidden text-base tracking-wide">
                                        {day.short}
                                    </span>
                                    
                                    {/* Desktop Text (Full) */}
                                    <span className="hidden sm:block capitalize tracking-wide">
                                        {day.name}
                                    </span>

                                    {/* Active Indicator Dot (Bottom) */}
                                    <div className={`
                                        absolute -bottom-1 left-1/2 transform -translate-x-1/2
                                        w-8 h-1 rounded-full transition-all duration-300
                                        ${isActive ? 'bg-white opacity-100' : 'bg-transparent opacity-0'}
                                    `} />
                                </div>
                            </NavLink>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}

export default Days;