import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Calendar, Check, Crown, Sparkles, Zap } from 'lucide-react';

function Subs() {
    const [user, setUser] = useState({});
    const [day, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const apiUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        axios.get(`${apiUrl}/user`, { withCredentials: true })
            .then(res => setUser(res.data))
            .catch(err => {
                if (err.response?.status === 401) {
                    window.location.href = "/Login";
                }
            });
    }, []);

    useEffect(() => {
        let intervalId = null;

        axios.get(`${apiUrl}/subs`, { withCredentials: true })
            .then(res => {
                if (res.data.doe == null) return;

                const target = new Date(res.data.doe);

                const updateOnce = () => {
                    const now = new Date();
                    const diffMs = target - now;

                    if (diffMs <= 0) {
                        setDays(0); setHours(0); setMinutes(0); setSeconds(0);
                        clearInterval(intervalId);
                        return;
                    }

                    const totalSec = Math.floor(diffMs / 1000);
                    const d = Math.floor(totalSec / (60 * 60 * 24));
                    const h = Math.floor((totalSec % (60 * 60 * 24)) / (60 * 60));
                    const m = Math.floor((totalSec % (60 * 60)) / 60);
                    const s = totalSec % 60;

                    setDays(d);
                    setHours(h);
                    setMinutes(m);
                    setSeconds(s);
                };

                updateOnce();
                intervalId = setInterval(updateOnce, 1000);
            })
            .catch(err => {
                console.error("Failed to fetch subscription date:", err);
            });

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, []);

    const checkoutHandler = async () => {
        const amount = 10;
        const { data: keyData } = await axios.get(`${apiUrl}/api/getKey`)
        const { key } = keyData;

        const { data: orderData } = await axios.post(`${apiUrl}/api/payment/process`, {
            amount
        })

        const { order } = orderData;

        const options = {
            key,
            amount,
            currency: 'INR',
            name: 'Karve Mess',
            description: 'Mnethly Pro Plan',
            order_id: order.id,
            handler: async function (response) {
                try {
                    const verifyRes = await axios.post(
                        `${apiUrl}/api/paymentVerification`,
                        {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        },
                        { withCredentials: true }
                    );

                    if (verifyRes.data.success) {
                        window.location.href = "/user";
                    } else {
                        alert("Payment verification failed");
                    }
                } catch (err) {
                    console.error("Verification error:", err);
                    alert("Payment verification error");
                }
            },
            prefill: {
                name: 'Chandraprakash Pandey',
                email: user.email,
            },
            theme: {
                color: '#312e81'
            },
        };

        const rzp = new Razorpay(options);
        rzp.open();
    }

    const features = [
        "Set weekly menu in advance",
        "Plan all dishes at once",
        "Schedule specific dishes for each day",
        "Save time with bulk menu management",
        "Edit anytime during the Month",
        "Priority support"
    ];

    return (
        <div className='min-h-screen bg-background-light dot-pattern py-16 px-4 font-display'>
            <div className='container mx-auto max-w-6xl'>
                {/* Header */}
                <div className='text-center mb-12'>
                    <div className='inline-flex items-center gap-2 bg-yellow-custom neo-border px-6 py-3 rounded-full mb-6 shadow-neo'>
                        <Sparkles className='w-5 h-5 text-indigo-custom stroke-[2.5]' />
                        <span className='text-sm font-black text-indigo-custom uppercase tracking-wide'>Premium Feature</span>
                    </div>
                    <h1 className='text-6xl font-black text-indigo-custom mb-6 uppercase tracking-tight leading-tight'>
                        Upgrade Your Mess Management
                    </h1>
                    <p className='text-xl text-indigo-custom/70 max-w-2xl mx-auto font-bold'>
                        Plan your entire week's menu at once and save valuable time
                    </p>
                </div>

                {/* Subscription Card */}
                <div className='max-w-md mx-auto'>
                    <div className='bg-white neo-border rounded-2xl shadow-neo-lg overflow-visible relative'>
                        

                        <div className='p-8'>
                            {/* Plan Header */}
                            <div className='mb-8'>
                                <h2 className='text-4xl font-black text-indigo-custom mb-2 uppercase tracking-tight'>Monthly Pro Plan</h2>
                                <p className='text-indigo-custom/70 font-bold'>Perfect for efficient mess management</p>
                            </div>

                            {/* Pricing */}
                            <div className='mb-8 bg-primary/10 neo-border p-6 rounded-xl shadow-neo-sm'>
                                <div className='flex items-baseline gap-2'>
                                    <span className='text-6xl font-black text-indigo-custom'>₹1</span>
                                    <span className='text-indigo-custom/70 font-bold'>/5 minutes</span>
                                </div>
                                <p className='text-sm text-indigo-custom/70 mt-2 font-medium'>Billed Mothly</p>
                            </div>

                            {/* Features List */}
                            <div className='mb-8'>
                                <h3 className='font-black text-lg text-indigo-custom mb-4 flex items-center gap-2 uppercase tracking-wide'>
                                    <Zap className='w-6 h-6 text-primary stroke-[2.5]' />
                                    What's Included
                                </h3>
                                <ul className='space-y-3'>
                                    {features.map((feature, idx) => (
                                        <li key={idx} className='flex items-start gap-3'>
                                            <div className='bg-primary neo-border rounded-lg p-1.5 mt-0.5 shrink-0'>
                                                <Check className='w-4 h-4 text-white stroke-[3]' />
                                            </div>
                                            <span className='text-indigo-custom font-medium'>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Key Benefit Box */}
                            <div className='mb-8 bg-yellow-custom/20 neo-border p-6 rounded-xl shadow-neo-sm'>
                                <div className='flex items-start gap-3'>
                                    <Calendar className='w-7 h-7 text-primary mt-1 shrink-0 stroke-[2.5]' />
                                    <div>
                                        <h4 className='font-black text-indigo-custom mb-2 uppercase tracking-wide'>Weekly Menu Planning</h4>
                                        <p className='text-sm text-indigo-custom/70 leading-relaxed font-medium'>
                                            Set your entire week's menu on Monday and forget about daily updates.
                                            Schedule breakfast, lunch, and dinner for all 7 days in one go.
                                            Make changes anytime with our flexible editing tools.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Subscribe Button */}
                            <button
                                onClick={() => checkoutHandler()}
                                disabled={minutes > 0}
                                className={`btn-lifted w-full text-white py-5 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all neo-border shadow-neo-lg uppercase tracking-widest ${minutes <= 0 ? "bg-primary hover:bg-yellow-custom hover:text-indigo-custom" : "bg-indigo-custom"} ${minutes > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                <Crown className='w-6 h-6 stroke-[2.5]' />
                                {minutes <= 0 ? "Subscribe Now" : "Your Current Plan"}
                            </button>

                            <p className='text-center text-xs text-indigo-custom/60 mt-4 font-medium'>
                                Secure payment • No hidden fees
                            </p>
                        </div>
                    </div>

                    {/* Trust Badge */}
                    <div className='text-center mt-8'>
                        <div className='inline-flex items-center gap-2 bg-white neo-border px-6 py-3 rounded-full shadow-neo'>
                            <span className='text-sm font-black text-indigo-custom'>
                                Trusted by 100+ mess owners • 4.9★ rating
                            </span>
                        </div>
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
                
                @keyframes rotate-tilt {
                    0%, 100% {
                        transform: rotate(0deg);
                    }
                    50% {
                        transform: rotate(3deg);
                    }
                }
                
                .rotate-tilt {
                    animation: rotate-tilt 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

export default Subs;