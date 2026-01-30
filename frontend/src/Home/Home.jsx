import React from 'react';
import { UtensilsCrossed, Clock, Calendar, Users, ArrowRight, CheckCircle, Sparkles, Bell, Shield, TrendingUp, Star, Wallet, Activity, ThumbsUp } from 'lucide-react';
import { NavLink } from 'react-router-dom';

function Home() {
    const features = [
        { 
            icon: Clock, 
            title: 'Real-Time Updates', 
            desc: 'Get instant notifications when the daily menu is posted',
            color: 'bg-primary'
        },
        { 
            icon: Users, 
            title: 'Student Friendly', 
            desc: 'Access the menu from anywhere on campus or at home',
            color: 'bg-indigo-custom'
        },
        { 
            icon: Calendar, 
            title: 'Daily Fresh Menu', 
            desc: 'New menu posted every morning with detailed meal info',
            color: 'bg-yellow-custom'
        },
        { 
            icon: Shield, 
            title: 'Always Accurate', 
            desc: 'Direct updates from mess management ensure reliability',
            color: 'bg-primary'
        }
    ];

    const stats = [
        { number: '500+', label: 'Active Students', trend: '+12%', bgColor: 'bg-white', textColor: 'text-primary' },
        { number: '3', label: 'Daily Meals', rating: '4.8/5', bgColor: 'bg-yellow-custom', textColor: 'text-indigo-custom' },
        { number: '100%', label: 'Updated Daily', subtitle: 'Fresh Menu', bgColor: 'bg-indigo-custom', textColor: 'text-white' }
    ];

    const bentoFeatures = [
        {
            title: 'Real-time Digital Menu',
            desc: 'Know exactly what\'s cooking before you even walk in. Real-time availability, ingredient lists, and live updates.',
            icon: Calendar,
            size: 'large',
            bgColor: 'bg-white'
        },
        {
            title: 'Instant Access',
            desc: 'One-tap access. Never wait in line to check the menu again.',
            icon: Wallet,
            size: 'wide',
            bgColor: 'bg-yellow-custom'
        },
        {
            title: 'Nutrition Info',
            desc: 'Track meal details automatically.',
            icon: Activity,
            size: 'square',
            bgColor: 'bg-primary'
        },
        {
            title: 'Feedback',
            desc: 'Rate your meals & influence the menu.',
            icon: ThumbsUp,
            size: 'square',
            bgColor: 'bg-white'
        }
    ];

    return (
        <div className="bg-background-light min-h-screen font-display text-indigo-custom dot-pattern">
            {/* Floating Action Buttons */}
            

            <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
                

                {/* Hero Section */}
                <section className="py-12 md:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="flex flex-col gap-8">
                            <div className="inline-block self-start px-4 py-1 bg-yellow-custom neo-border rounded-full font-bold text-sm shadow-neo flex items-center gap-2">
                                
                                YOUR CAMPUS DINING COMPANION
                            </div>
                            
                            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight text-indigo-custom">
                                KarveMess <span className="text-primary italic">Management</span>.
                            </h1>
                            
                            <p className="text-xl font-medium leading-relaxed max-w-lg text-indigo-custom/80">
                                Never wonder what's for lunch again. Check today's menu instantly, plan your meals, and stay updated with real-time notifications.
                            </p>
                            
                            <div className="flex flex-wrap gap-4">
                                <NavLink 
                                    to="/Menu"
                                    className="btn-lifted h-14 px-10 bg-primary neo-border rounded-xl flex items-center justify-center font-black text-white text-lg uppercase tracking-widest group"
                                >
                                    Explore Menu
                                    <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                                </NavLink>
                                <a 
                                    href="#features"
                                    className="btn-lifted h-14 px-8 bg-white neo-border rounded-xl flex items-center justify-center font-black text-indigo-custom text-lg uppercase tracking-widest"
                                >
                                    How it works
                                </a>
                            </div>
                        </div>
                        
                        <div className="relative">
                            <div className="aspect-square bg-yellow-custom/20 neo-border rounded-[2rem] shadow-neo-lg overflow-hidden group">
                                <img 
                                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=800&fit=crop" 
                                    alt="Delicious healthy food bowls"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-10" id="stats">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className={`${stat.bgColor} neo-border p-8 rounded-xl shadow-neo flex flex-col gap-2`}>
                                <p className={`${stat.textColor} font-black uppercase text-sm tracking-widest`}>{stat.label}</p>
                                <div className="flex items-end gap-2">
                                    <span className={`text-5xl font-black ${idx === 2 ? 'text-white' : ''}`}>{stat.number}</span>
                                    {stat.trend && (
                                        <span className="text-green-600 font-bold mb-1 flex items-center">
                                            <TrendingUp className="w-5 h-5" />{stat.trend}
                                        </span>
                                    )}
                                    {stat.rating && (
                                        <span className="text-indigo-custom font-bold mb-1 flex items-center">
                                            <Star className="w-5 h-5 fill-current" />{stat.rating}
                                        </span>
                                    )}
                                </div>
                                <p className={`font-bold ${idx === 2 ? 'text-white/60' : 'text-indigo-custom/60'}`}>
                                    {idx === 0 && 'Daily meals served across campus'}
                                    {idx === 1 && 'Based on student reviews'}
                                    {idx === 2 && 'Optimized meal planning'}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Bento Grid Features */}
                <section className="py-20 " id="features">
                    <h2 className="text-4xl font-black mb-12 text-center uppercase tracking-tight py-5">
                        Why <span className="underline decoration-primary decoration-8 underline-offset-4">Students</span> Love It
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
                        {/* Feature 1: Large Box */}
                        <div className="md:col-span-2 md:row-span-2 bg-white neo-border rounded-2xl p-8 card-lifted shadow-neo flex flex-col justify-between group">
                            <div>
                                <div className="size-16 bg-primary/10 neo-border rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors rotate-tilt">
                                    <Calendar className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-3xl font-black mb-4 uppercase">Real-time Digital Menu</h3>
                                <p className="text-lg font-medium text-indigo-custom/70">
                                    Know exactly what's cooking before you even walk in. Real-time availability, ingredient lists, and live crowd tracking.
                                </p>
                            </div>
                            <div className="mt-8 overflow-hidden rounded-xl neo-border h-48 relative group/image">
                                <img 
                                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop" 
                                    alt="Delicious gourmet meal"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-125"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </div>
                        
                        {/* Feature 2: Wide Box */}
                        <div className="md:col-span-2 bg-yellow-custom neo-border rounded-2xl p-8 card-lifted shadow-neo flex items-center gap-6 group">
                            <div className="flex-1">
                                <h3 className="text-2xl font-black mb-2 uppercase">Instant Access</h3>
                                <p className="font-bold text-indigo-custom/70">One-tap access. Never wait in line to check the menu again.</p>
                            </div>
                            <div className="size-24 shrink-0 bg-white neo-border rounded-full flex items-center justify-center shadow-neo spin-slow">
                                <Clock className="w-12 h-12 text-indigo-custom group-hover:scale-110 transition-transform" />
                            </div>
                        </div>
                        
                        {/* Feature 3: Square Box */}
                        <div className="bg-primary neo-border rounded-2xl p-8 card-lifted shadow-neo flex flex-col justify-center items-center text-center gap-4 text-white group">
                            <Activity className="w-12 h-12 wiggle" />
                            <div>
                                <h3 className="text-xl font-black uppercase">Nutrition</h3>
                                <p className="font-bold text-white/80 text-sm leading-tight">Track meal details automatically.</p>
                            </div>
                        </div>
                        
                        {/* Feature 4: Square Box */}
                        <div className="bg-white neo-border rounded-2xl p-8 card-lifted shadow-neo flex flex-col justify-center items-center text-center gap-4 group">
                            <ThumbsUp className="w-12 h-12 text-indigo-custom bounce-subtle" />
                            <div>
                                <h3 className="text-xl font-black uppercase">Feedback</h3>
                                <p className="font-bold text-indigo-custom/70 text-sm leading-tight">Rate your meals & influence the menu.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="py-20">
                    <div className="bg-indigo-custom neo-border rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-neo-lg">
                        {/* Background Decorations */}
                        <div className="absolute top-10 left-10 text-white/10 text-9xl font-black select-none pointer-events-none">MESS</div>
                        <div className="absolute bottom-10 right-10 text-white/10 text-9xl font-black select-none pointer-events-none">MENU</div>
                        
                        <div className="relative z-10 flex flex-col items-center gap-8">
                            <Bell className="w-12 h-12 text-white" />
                            <h2 className="text-4xl md:text-6xl font-black text-white max-w-2xl leading-tight">
                                NEVER MISS A <span className="text-yellow-custom">MEAL UPDATE.</span>
                            </h2>
                            <p className="text-white/70 text-lg font-medium max-w-lg">
                                Get started today and join hundreds of students who check their mess menu online
                            </p>
                            <div className="flex flex-wrap justify-center gap-6 mt-4">
                                <NavLink 
                                    to="/Menu"
                                    className="btn-lifted h-16 px-12 bg-primary neo-border rounded-xl flex items-center justify-center font-black text-white text-xl uppercase tracking-widest"
                                >
                                    Get Started
                                </NavLink>
                                <button className="btn-lifted h-16 px-12 bg-white neo-border rounded-xl flex items-center justify-center font-black text-indigo-custom text-xl uppercase tracking-widest">
                                    Contact Admin
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                
            </div>

            <style jsx>{`
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
                .card-lifted {
                    transition: all 0.2s ease;
                }
                .card-lifted:hover {
                    transform: translate(-4px, -4px);
                    box-shadow: 12px 12px 0px 0px #312e81;
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
                .shadow-neo {
                    box-shadow: 4px 4px 0px 0px #312e81;
                }
                .shadow-neo-lg {
                    box-shadow: 8px 8px 0px 0px #312e81;
                }
                .border-t-3 {
                    border-top-width: 3px;
                }
                .decoration-8 {
                    text-decoration-thickness: 8px;
                }
                .underline-offset-4 {
                    text-underline-offset: 4px;
                }
                .font-display {
                    font-family: system-ui, -apple-system, sans-serif;
                }
                
                /* Cool Animations */
                @keyframes floating {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }
                
                @keyframes pulse-scale {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.1);
                    }
                }
                
                @keyframes spin-slow {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                
                @keyframes wiggle {
                    0%, 100% {
                        transform: rotate(0deg);
                    }
                    25% {
                        transform: rotate(-5deg);
                    }
                    75% {
                        transform: rotate(5deg);
                    }
                }
                
                @keyframes bounce-subtle {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-5px);
                    }
                }
                
                @keyframes rotate-tilt {
                    0%, 100% {
                        transform: rotate(0deg);
                    }
                    50% {
                        transform: rotate(3deg);
                    }
                }
                
                .floating {
                    animation: floating 3s ease-in-out infinite;
                }
                
                .pulse-scale {
                    animation: pulse-scale 2s ease-in-out infinite;
                }
                
                .spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
                
                .wiggle {
                    animation: wiggle 2s ease-in-out infinite;
                }
                
                .bounce-subtle {
                    animation: bounce-subtle 2s ease-in-out infinite;
                }
                
                .rotate-tilt {
                    animation: rotate-tilt 3s ease-in-out infinite;
                }
                
                /* Hover effects */
                .group:hover .floating {
                    animation-duration: 1.5s;
                }
                
                .group:hover .wiggle {
                    animation-duration: 0.5s;
                }
            `}</style>
        </div>
    );
}

export default Home;