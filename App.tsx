import React, { useState, useCallback, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ContestsPage from './pages/ContestsPage';
import ContestPage from './pages/ContestPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import { Page, PageNav, Theme } from './types';


const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

const AppContent: React.FC = () => {
    const [page, setPage] = useState<Page>({ name: 'home' });
    const [theme, setTheme] = useState<Theme>('dark');
    const { user } = useAuth();

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    }, []);

    const navigate = useCallback((pageNav: PageNav) => {
        if (typeof pageNav === 'string') {
            if (pageNav === 'contest' || pageNav === 'verify-email') {
                // Fallback for pages that require additional data
                setPage({ name: 'home' });
            } else {
                setPage({ name: pageNav } as Page);
            }
        } else {
            setPage(pageNav);
        }
    }, []);

    const renderPage = () => {
        switch (page.name) {
            case 'home':
                return <HomePage navigate={navigate} />;
            case 'auth':
                return <AuthPage navigate={navigate} />;
            case 'verify-email':
                return <VerifyEmailPage email={page.email || ''} navigate={navigate} />;
            case 'contests':
                return <ContestsPage navigate={navigate} />;
            case 'contest':
                return <ContestPage contestId={page.contestId || ''} navigate={navigate} />;
            case 'profile':
                return <ProfilePage />;
            case 'admin':
                return <AdminPage />;
            default:
                return <HomePage navigate={navigate} />;
        }
    };
    
    return (
        <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark-bg dark:bg-gradient-to-br dark:from-dark-bg dark:via-royal-purple-dark dark:to-dark-bg bg-[length:200%_200%] dark:animate-gradient-bg transition-colors duration-500">
            <Header navigate={navigate} theme={theme} toggleTheme={toggleTheme} />
            <main className="flex-grow container mx-auto px-4 py-8">
                {renderPage()}
            </main>
            <Footer />
        </div>
    );
};

export default App;