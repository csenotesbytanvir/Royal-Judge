import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { NavigationFunc } from '../types';

interface AuthPageProps {
    navigate: NavigationFunc;
}

const AuthPage: React.FC<AuthPageProps> = ({ navigate }) => {
    const [isLogin, setIsLogin] = useState(true);
    const { login, signup } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await login(email, password);
                navigate('contests');
            } else {
                await signup(username, email, password);
                navigate({ name: 'verify-email', email });
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-light-surface dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-royal-purple/50 shadow-2xl shadow-royal-purple/10">
            <div className="flex border-b border-gray-300 dark:border-royal-purple/50 mb-6">
                <button onClick={() => setIsLogin(true)} className={`flex-1 py-3 font-bold text-lg transition-colors ${isLogin ? 'text-royal-purple dark:text-royal-gold border-b-2 border-royal-purple dark:border-royal-gold' : 'text-gray-400'}`}>Login</button>
                <button onClick={() => setIsLogin(false)} className={`flex-1 py-3 font-bold text-lg transition-colors ${!isLogin ? 'text-royal-purple dark:text-royal-gold border-b-2 border-royal-purple dark:border-royal-gold' : 'text-gray-400'}`}>Signup</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                    <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required className="w-full px-4 py-3 bg-light-bg dark:bg-dark-bg border border-gray-300 dark:border-royal-purple/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-purple dark:focus:ring-royal-gold" />
                )}
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 bg-light-bg dark:bg-dark-bg border border-gray-300 dark:border-royal-purple/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-purple dark:focus:ring-royal-gold" />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 bg-light-bg dark:bg-dark-bg border border-gray-300 dark:border-royal-purple/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-purple dark:focus:ring-royal-gold" />
                
                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button type="submit" disabled={loading} className="w-full py-3 font-bold text-dark-bg bg-royal-gold rounded-lg hover:bg-royal-gold-dark transition-colors disabled:bg-gray-600">
                    {loading ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Login' : 'Signup')}
                </button>
            </form>
        </div>
    );
};

export default AuthPage;