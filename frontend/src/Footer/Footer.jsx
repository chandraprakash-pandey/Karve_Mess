import React from 'react';
import { UtensilsCrossed, Mail, Linkedin, Heart, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { name: 'View Menu', path: '/Menu', external: false },
            { name: 'Owner Login', path: '/Signup', external: false },
            { name: 'Features', path: '#features', external: true }
        ],
        support: [
            { name: 'Help Center', path: '#help', external: true },
            { name: 'Contact Us', path: '#contact', external: true },
            { name: 'FAQs', path: '#faq', external: true }
        ],
        legal: [
            { name: 'Privacy Policy', path: '#privacy', external: true },
            { name: 'Terms of Service', path: '#terms', external: true },
            { name: 'Cookie Policy', path: '#cookies', external: true }
        ]
    };

    return (
        <footer className="bg-background-light font-display text-indigo-custom dot-pattern">
            <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-12 bg-primary neo-border rounded-xl flex items-center justify-center shadow-neo pulse-scale">
                                <UtensilsCrossed className="w-6 h-6 text-white stroke-[3]" />
                            </div>
                            <span className="text-2xl font-extrabold tracking-tight">KarveMess</span>
                        </div>
                        <p className="text-indigo-custom/70 mb-6 leading-relaxed font-medium">
                            Your trusted campus dining companion. Stay updated with daily menus and never miss a meal.
                        </p>
                        <div className="flex gap-3">
                            <a 
                                href="mailto:cp.o.pandey@gmail.com"
                                className="btn-lifted size-12 bg-white neo-border rounded-xl flex items-center justify-center hover:bg-primary group transition-colors shadow-neo"
                                aria-label="Email"
                            >
                                <Mail className="w-5 h-5 text-indigo-custom group-hover:text-white transition-colors" />
                            </a>
                            <a 
                                href="https://www.linkedin.com/in/chandraprakash-pandey/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-lifted size-12 bg-white neo-border rounded-xl flex items-center justify-center hover:bg-primary group transition-colors shadow-neo"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="w-5 h-5 text-indigo-custom group-hover:text-white transition-colors" />
                            </a>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="text-indigo-custom font-black text-lg mb-6 uppercase tracking-wide">Product</h3>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link, idx) => (
                                <li key={idx}>
                                    {link.external ? (
                                        <a 
                                            href={link.path}
                                            className="text-indigo-custom/70 hover:text-primary transition-colors font-bold inline-flex items-center group"
                                        >
                                            <ArrowRight className="w-4 h-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                            <span>{link.name}</span>
                                        </a>
                                    ) : (
                                        <NavLink 
                                            to={link.path}
                                            className="text-indigo-custom/70 hover:text-primary transition-colors font-bold inline-flex items-center group"
                                        >
                                            <ArrowRight className="w-4 h-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                            <span>{link.name}</span>
                                        </NavLink>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-indigo-custom font-black text-lg mb-6 uppercase tracking-wide">Support</h3>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link, idx) => (
                                <li key={idx}>
                                    <a 
                                        href={link.path}
                                        className="text-indigo-custom/70 hover:text-primary transition-colors font-bold inline-flex items-center group"
                                    >
                                        <ArrowRight className="w-4 h-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        <span>{link.name}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="text-indigo-custom font-black text-lg mb-6 uppercase tracking-wide">Legal</h3>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link, idx) => (
                                <li key={idx}>
                                    <a 
                                        href={link.path}
                                        className="text-indigo-custom/70 hover:text-primary transition-colors font-bold inline-flex items-center group"
                                    >
                                        <ArrowRight className="w-4 h-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        <span>{link.name}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t-3 border-indigo-custom my-8"></div>

                {/* Bottom Footer */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="font-bold text-indigo-custom/60 text-center md:text-left">
                        © {currentYear} KarveMess. Menu updated daily by mess management.
                    </p>
                    <div className="flex items-center gap-2 text-indigo-custom/60 font-bold">
                        <span>Made with</span>
                        <Heart className="w-4 h-4 text-primary fill-current wiggle" />
                        <span>for students</span>
                    </div>
                </div>
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
                .bg-background-light {
                    background-color: #fffdf5;
                }
                .shadow-neo {
                    box-shadow: 4px 4px 0px 0px #312e81;
                }
                .border-t-3 {
                    border-top-width: 3px;
                }
                .font-display {
                    font-family: system-ui, -apple-system, sans-serif;
                }
                
                /* Animations */
                @keyframes pulse-scale {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.1);
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
                
                .pulse-scale {
                    animation: pulse-scale 2s ease-in-out infinite;
                }
                
                .wiggle {
                    animation: wiggle 2s ease-in-out infinite;
                }
            `}</style>
        </footer>
    );
}

export default Footer;