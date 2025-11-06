import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { NavigationFunc } from '../types';

interface VerifyEmailPageProps {
    email: string;
    navigate: NavigationFunc;
}

const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({ email, navigate }) => {
    const { verify } = useAuth();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await verify(email, code);
            navigate('contests');
        } catch (err: any) {
            setError(err.message || 'Verification failed.');
        } finally {
            setLoading(false);
        }
    };

    if (!email) {
        return (
            <div className="text-center">
                <p>No email provided. Please <a onClick={() => navigate('auth')} className="text-royal-purple dark:text-royal-gold underline cursor-pointer">sign up</a> again.</p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-light-surface dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-royal-purple/50 shadow-2xl shadow-royal-purple/10 text-center">
            <h1 className="text-3xl font-bold text-royal-purple dark:text-royal-gold mb-4">Verify Your Crown</h1>
            <p className="text-light-text-secondary dark:text-gray-300 mb-6">
                A verification code has been "sent" to <strong>{email}</strong>. Enter it below to activate your account.
            </p>
            
            <div className="my-4 p-3 bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-400 dark:border-yellow-600 rounded-lg">
                <p className="text-yellow-800 dark:text-yellow-200">For this demo, the verification code is always: <strong className="font-mono text-lg">123456</strong></p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <input 
                    type="text" 
                    placeholder="Enter 6-digit code" 
                    value={code} 
                    onChange={e => setCode(e.target.value)} 
                    required 
                    maxLength={6}
                    className="w-full px-4 py-3 bg-light-bg dark:bg-dark-bg border border-gray-300 dark:border-royal-purple/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-purple dark:focus:ring-royal-gold text-center font-mono tracking-[0.5em]" 
                />
                
                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button type="submit" disabled={loading} className="w-full py-3 font-bold text-dark-bg bg-royal-gold rounded-lg hover:bg-royal-gold-dark transition-colors disabled:bg-gray-600">
                    {loading ? 'Verifying...' : 'Verify & Enter'}
                </button>
            </form>
        </div>
    );
};

export default VerifyEmailPage;