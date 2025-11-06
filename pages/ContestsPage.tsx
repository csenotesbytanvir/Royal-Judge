
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Contest, NavigationFunc } from '../types';

interface ContestsPageProps {
    navigate: NavigationFunc;
}

const ContestCard: React.FC<{ contest: Contest; status: string; navigate: NavigationFunc }> = ({ contest, status, navigate }) => {
    let statusColor = '';
    switch (status) {
        case 'Active': statusColor = 'text-green-500 dark:text-green-400'; break;
        case 'Upcoming': statusColor = 'text-yellow-500 dark:text-yellow-400'; break;
        case 'Past': statusColor = 'text-gray-500 dark:text-gray-500'; break;
    }

    return (
        <div className="bg-light-surface dark:bg-dark-surface border border-gray-200 dark:border-royal-purple/30 rounded-lg p-6 hover:border-royal-purple dark:hover:border-royal-gold transition-all duration-300 hover:shadow-2xl hover:shadow-royal-purple/20 transform hover:-translate-y-2">
            <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold mb-2 text-light-text dark:text-white">{contest.title}</h3>
                <span className={`font-mono text-sm font-bold ${statusColor}`}>{status}</span>
            </div>
            <p className="text-light-text-secondary dark:text-gray-400 mb-4 h-12 overflow-hidden">{contest.description}</p>
            <div className="font-mono text-sm text-light-text-secondary dark:text-gray-400 space-y-1 mb-6">
                <p><strong>Starts:</strong> {contest.startTime.toLocaleString()}</p>
                <p><strong>Ends:</strong> {contest.endTime.toLocaleString()}</p>
            </div>
            <button
                onClick={() => navigate({ name: 'contest', contestId: contest.id })}
                className="w-full py-2 font-bold text-white dark:text-dark-bg bg-royal-purple hover:bg-royal-purple-light dark:bg-royal-purple dark:hover:bg-royal-purple-light transition-colors rounded-md"
            >
                View Contest
            </button>
        </div>
    );
};


const ContestsPage: React.FC<ContestsPageProps> = ({ navigate }) => {
    const [contests, setContests] = useState<Contest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContests = async () => {
            setLoading(true);
            const data = await api.getContests();
            setContests(data);
            setLoading(false);
        };
        fetchContests();
    }, []);

    const now = new Date();
    const activeContests = contests.filter(c => c.startTime <= now && c.endTime > now);
    const upcomingContests = contests.filter(c => c.startTime > now);
    const pastContests = contests.filter(c => c.endTime <= now);

    if (loading) return <div className="text-center text-xl">Loading contests...</div>;

    return (
        <div className="space-y-12">
            <div>
                <h2 className="text-4xl font-bold text-royal-purple dark:text-royal-gold mb-6 border-b-2 border-gray-300 dark:border-royal-purple/50 pb-2">Active Contests</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {activeContests.length > 0 ? activeContests.map(c => <ContestCard key={c.id} contest={c} status="Active" navigate={navigate} />) : <p className="text-light-text-secondary dark:text-gray-400">No active contests right now.</p>}
                </div>
            </div>
            <div>
                <h2 className="text-4xl font-bold text-royal-purple dark:text-royal-gold mb-6 border-b-2 border-gray-300 dark:border-royal-purple/50 pb-2">Upcoming Contests</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {upcomingContests.length > 0 ? upcomingContests.map(c => <ContestCard key={c.id} contest={c} status="Upcoming" navigate={navigate} />) : <p className="text-light-text-secondary dark:text-gray-400">No upcoming contests scheduled.</p>}
                </div>
            </div>
            <div>
                <h2 className="text-4xl font-bold text-royal-purple dark:text-royal-gold mb-6 border-b-2 border-gray-300 dark:border-royal-purple/50 pb-2">Past Contests</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pastContests.length > 0 ? pastContests.map(c => <ContestCard key={c.id} contest={c} status="Past" navigate={navigate} />) : <p className="text-light-text-secondary dark:text-gray-400">No past contests yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default ContestsPage;