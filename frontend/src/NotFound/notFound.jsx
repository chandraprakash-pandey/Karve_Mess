import React, { useState, useEffect } from 'react'

function NotFound() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    const parallaxX = (mousePosition.x - window.innerWidth / 2) / 50
    const parallaxY = (mousePosition.y - window.innerHeight / 2) / 50

    return (
        <div className="relative min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div 
                    className="absolute w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                    style={{
                        top: '10%',
                        left: '10%',
                        transform: `translate(${parallaxX}px, ${parallaxY}px)`
                    }}
                />
                <div 
                    className="absolute w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                    style={{
                        bottom: '10%',
                        right: '10%',
                        transform: `translate(${-parallaxX}px, ${-parallaxY}px)`,
                        animationDelay: '1s'
                    }}
                />
                <div 
                    className="absolute w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                    style={{
                        top: '50%',
                        left: '50%',
                        transform: `translate(${parallaxX * 2}px, ${parallaxY * 2}px)`,
                        animationDelay: '2s'
                    }}
                />
            </div>

            {/* Main content */}
            <div className="relative z-10 text-center px-6">
                <div className="mb-8">
                    <h1 className="text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-pink-400 to-blue-400 animate-pulse mb-4">
                        404
                    </h1>
                    <div className="h-1 w-64 mx-auto bg-linear-to-r from-purple-400 via-pink-400 to-blue-400 rounded-full mb-8"></div>
                </div>

                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                    Oops! Page Not Found
                </h2>
                
                <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-md mx-auto">
                    The page you're looking for seems to have vanished into the digital void.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button 
                        onClick={() => window.history.back()}
                        className="group relative px-8 py-3 bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
                    >
                        <span className="relative z-10">Go Back</span>
                        <div className="absolute inset-0 bg-linear-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                    
                    <button 
                        onClick={() => window.location.href = '/'}
                        className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg border-2 border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-xl"
                    >
                        Home Page
                    </button>
                </div>

                {/* Floating elements */}
                <div className="mt-16 flex justify-center gap-8">
                    <div className="animate-bounce" style={{ animationDelay: '0s' }}>
                        <div className="w-3 h-3 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"></div>
                    </div>
                    <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>
                        <div className="w-3 h-3 bg-pink-400 rounded-full shadow-lg shadow-pink-400/50"></div>
                    </div>
                    <div className="animate-bounce" style={{ animationDelay: '0.4s' }}>
                        <div className="w-3 h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
                    </div>
                </div>
            </div>

            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        </div>
    )
}

export default NotFound