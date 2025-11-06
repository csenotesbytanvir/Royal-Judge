
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { NavigationFunc, Role, Theme } from '../types';

interface HeaderProps {
    navigate: NavigationFunc;
    theme: Theme;
    toggleTheme: () => void;
}

const NavLink: React.FC<{ onClick: () => void, children: React.ReactNode }> = ({ onClick, children }) => (
    <button onClick={onClick} className="font-mono text-light-text-secondary dark:text-gray-300 hover:text-royal-purple dark:hover:text-royal-gold transition-colors duration-300">
        {children}
    </button>
);

const Header: React.FC<HeaderProps> = ({ navigate, theme, toggleTheme }) => {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <header className="bg-light-surface/80 dark:bg-dark-surface/50 backdrop-blur-sm border-b border-gray-200 dark:border-royal-purple/50 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    <button onClick={() => navigate('home')} className="text-3xl font-bold font-sans tracking-wider text-light-text dark:text-white hover:text-royal-purple dark:hover:text-royal-gold transition-transform duration-300 ease-in-out hover:scale-105">
                        <span className="text-royal-purple dark:text-royal-gold">R</span>oyal <span className="text-royal-purple dark:text-royal-gold">J</span>udge
                    </button>
                    <nav className="hidden md:flex items-center space-x-8">
                        <NavLink onClick={() => navigate('contests')}>Contests</NavLink>
                        {user?.role === Role.ADMIN && <NavLink onClick={() => navigate('admin')}>Admin</NavLink>}
                    </nav>
                    <div className="flex items-center space-x-4">
                         <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-royal-purple/20 transition-colors">
                            {theme === 'dark' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-royal-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-royal-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>
                        {isAuthenticated ? (
                            <>
                                <NavLink onClick={() => navigate('profile')}>{user?.username}</NavLink>
                                <button
                                    onClick={() => { logout(); navigate('home'); }}
                                    className="px-4 py-2 bg-royal-gold text-dark-bg font-bold rounded-md hover:bg-royal-gold/80 transition-colors duration-300"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => navigate('auth')}
                                className="px-4 py-2 bg-royal-purple hover:bg-royal-purple-light text-white font-bold rounded-md transition-colors duration-300"
                            >
                                Login / Signup
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;