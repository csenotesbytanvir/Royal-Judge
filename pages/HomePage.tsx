
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { NavigationFunc } from '../types';

interface HomePageProps {
    navigate: NavigationFunc;
}

const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
    const { isAuthenticated } = useAuth();
    return (
        <div className="text-center flex flex-col items-center justify-center py-20">
            <h1 className="text-6xl md:text-8xl font-bold font-sans bg-clip-text text-transparent bg-gradient-to-r from-royal-purple to-cyber-blue dark:from-royal-gold dark:to-cyber-blue mb-4">
                Royal Judge
            </h1>
            <p className="text-xl md:text-2xl text-light-text-secondary dark:text-gray-300 font-mono mb-12 max-w-2xl">
                Ascend to the throne of coding. Compete, conquer, and claim your crown in the ultimate programming arena.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                <button
                    onClick={() => navigate('contests')}
                    className="px-8 py-4 text-lg font-bold text-dark-bg bg-royal-gold rounded-lg shadow-lg shadow-royal-gold/20 hover:bg-royal-gold-dark transform hover:-translate-y-1 transition-all duration-300"
                >
                    View Contests
                </button>
                {!isAuthenticated && (
                    <button
                        onClick={() => navigate('auth')}
                        className="px-8 py-4 text-lg font-bold text-white bg-royal-purple rounded-lg shadow-lg shadow-royal-purple/20 hover:bg-royal-purple-light transform hover:-translate-y-1 transition-all duration-300"
                    >
                        Login / Join The Arena
                    </button>
                )}
            </div>
        </div>
    );
};

export default HomePage;