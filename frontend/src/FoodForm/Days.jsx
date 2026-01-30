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
        <div className="w-full bg-background-light relative overflow-hidden border-b-4 border-indigo-custom shadow-neo-lg dot-pattern">
            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <nav 
                    ref={scrollRef}
                    className="
                        flex items-center gap-3 py-6 
                        overflow-x-auto snap-x snap-mandatory
                        scrollbar-hide 
                        md:justify-center justify-start
                    "
                    style={{ 
                        msOverflowStyle: 'none', 
                        scrollbarWidth: 'none' 
                    }}
                >
                    {/* CSS to hide scrollbar for Webkit (Chrome/Safari) */}
                    <style>{`
                        nav::-webkit-scrollbar { display: none; }
                        .neo-border {
                            border: 3px solid #312e81;
                        }
                        .dot-pattern {
                            background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
                            background-size: 20px 20px;
                        }
                        .btn-lifted {
                            transition: all 0.2s ease;
                            box-shadow: 4px 4px 0px 0px #312e81;
                        }
                        .btn-lifted:hover {
                            transform: translate(2px, 2px);
                            box-shadow: 0px 0px 0px 0px #312e81;
                        }
                        .btn-lifted:active {
                            transform: translate(2px, 2px);
                            box-shadow: 0px 0px 0px 0px #312e81;
                        }
                        .bg-primary {
                            background-color: #f87116;
                        }
                        .text-primary {
                            color: #f87116;
                        }
                        .bg-indigo-custom {
                            background-color: #312e81;
                        }
                        .text-indigo-custom {
                            color: #312e81;
                        }
                        .bg-yellow-custom {
                            background-color: #facc15;
                        }
                        .text-yellow-custom {
                            color: #facc15;
                        }
                        .bg-background-light {
                            background-color: #fffdf5;
                        }
                        .shadow-neo-sm {
                            box-shadow: 2px 2px 0px 0px #312e81;
                        }
                        .shadow-neo {
                            box-shadow: 4px 4px 0px 0px #312e81;
                        }
                        .shadow-neo-lg {
                            box-shadow: 8px 8px 0px 0px #312e81;
                        }
                        .font-display {
                            font-family: system-ui, -apple-system, sans-serif;
                        }
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
                                    btn-lifted relative px-6 py-3 rounded-xl 
                                    font-black text-sm transition-all duration-200
                                    neo-border
                                    flex flex-col items-center justify-center
                                    min-w-20 sm:min-w-[100px]
                                    uppercase tracking-wide
                                    ${isActive 
                                        ? 'bg-yellow-custom text-indigo-custom shadow-neo scale-105' 
                                        : 'bg-white text-indigo-custom hover:bg-yellow-custom/30 shadow-neo-sm'
                                    }
                                `}>
                                    {/* Mobile Text (Short) */}
                                    <span className="block sm:hidden text-base">
                                        {day.short}
                                    </span>
                                    
                                    {/* Desktop Text (Full) */}
                                    <span className="hidden sm:block">
                                        {day.name}
                                    </span>

                                    {/* Active Indicator Dot (Bottom) */}
                                    <div className={`
                                        absolute -bottom-2 left-1/2 transform -translate-x-1/2
                                        w-3 h-3 rounded-full transition-all duration-300 neo-border
                                        ${isActive ? 'bg-primary opacity-100' : 'bg-transparent opacity-0'}
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