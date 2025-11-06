
import React from 'react';
import { useAuth } from '../hooks/useAuth';

const ProfilePage: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="text-center">Loading profile...</div>;
    }

    if (!user) {
        return <div className="text-center">Please login to view your profile.</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-8 bg-light-surface dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-royal-purple/50 shadow-2xl shadow-royal-purple/10">
            <h1 className="text-4xl font-bold text-royal-purple dark:text-royal-gold mb-6 text-center">Your Profile</h1>
            <div className="space-y-4 font-mono">
                <div className="flex justify-between items-center p-3 bg-light-bg dark:bg-dark-bg rounded-md">
                    <span className="text-light-text-secondary dark:text-gray-400">Username:</span>
                    <span className="text-lg font-bold">{user.username}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-light-bg dark:bg-dark-bg rounded-md">
                    <span className="text-light-text-secondary dark:text-gray-400">Email:</span>
                    <span className="text-lg font-bold">{user.email}</span>
                </div>
                 <div className="flex justify-between items-center p-3 bg-light-bg dark:bg-dark-bg rounded-md">
                    <span className="text-light-text-secondary dark:text-gray-400">Role:</span>
                    <span className="text-lg font-bold uppercase">{user.role}</span>
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-2xl font-bold text-royal-purple dark:text-royal-gold mb-4 border-b border-gray-300 dark:border-royal-purple/30 pb-2">Contest History</h2>
                {user.contestHistory.length > 0 ? (
                     <div className="space-y-2">
                        {user.contestHistory.map(history => (
                            <div key={history.contestId} className="flex justify-between items-center p-3 bg-light-bg dark:bg-dark-bg rounded-md font-mono">
                                <span className="font-bold">Contest ID: {history.contestId}</span>
                                <span className="text-royal-purple dark:text-royal-gold">Rank: #{history.rank}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-light-text-secondary dark:text-gray-400">You haven't participated in any contests yet.</p>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;