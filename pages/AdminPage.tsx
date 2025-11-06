
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { NavigationFunc, Role, Contest, Problem } from '../types';
import { api } from '../services/api';

const AdminPage: React.FC = () => {
    const { user, isAdmin } = useAuth();
    const [contests, setContests] = useState<Contest[]>([]);

    useEffect(() => {
        api.getContests().then(setContests);
    }, []);

    if (!user || !isAdmin) {
        return <div className="text-center text-red-500 text-2xl">Access Denied. You are not a king.</div>;
    }
    
    const onContestCreated = (newContest: Contest) => {
        setContests(prev => [newContest, ...prev]);
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-royal-purple dark:text-royal-gold text-center mb-10">Admin Throne Room</h1>
            <div className="grid md:grid-cols-2 gap-8">
                <CreateContestForm onContestCreated={onContestCreated} />
                <AddProblemForm contests={contests} />
            </div>
        </div>
    );
};

const CreateContestForm: React.FC<{ onContestCreated: (contest: Contest) => void }> = ({onContestCreated}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Creating...');
        try {
            const newContest = await api.createContest(title, description, new Date(startTime), new Date(endTime));
            setStatus(`Contest "${newContest.title}" created successfully!`);
            onContestCreated(newContest);
            setTitle('');
            setDescription('');
            setStartTime('');
            setEndTime('');
        } catch (err) {
            setStatus('Failed to create contest.');
        }
    };
    
    return (
        <div className="bg-light-surface dark:bg-dark-surface p-6 rounded-lg border border-gray-200 dark:border-royal-purple/50">
            <h2 className="text-2xl font-bold mb-4">Create New Contest</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Contest Title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 bg-light-bg dark:bg-dark-bg rounded border border-gray-300 dark:border-royal-purple/30" />
                <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required className="w-full p-2 bg-light-bg dark:bg-dark-bg rounded border border-gray-300 dark:border-royal-purple/30 h-24" />
                <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required className="w-full p-2 bg-light-bg dark:bg-dark-bg rounded border border-gray-300 dark:border-royal-purple/30" />
                <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required className="w-full p-2 bg-light-bg dark:bg-dark-bg rounded border border-gray-300 dark:border-royal-purple/30" />
                <button type="submit" className="w-full py-2 bg-royal-gold text-dark-bg font-bold rounded">Create Contest</button>
                 {status && <p className="text-center mt-2 text-yellow-500 dark:text-yellow-300">{status}</p>}
            </form>
        </div>
    );
};

const AddProblemForm: React.FC<{contests: Contest[]}> = ({contests}) => {
    const [selectedContest, setSelectedContest] = useState('');
    const [title, setTitle] = useState('');
    const [statement, setStatement] = useState('');
    const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
    const [points, setPoints] = useState(100);
    const [status, setStatus] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!selectedContest) {
            setStatus("Please select a contest.");
            return;
        }
        setStatus('Adding problem...');
        try {
            const newProblemData = { title, statement, difficulty, points, inputFormat: "TBD", outputFormat: "TBD", sampleCases: [], tags: [] };
            const newProblem = await api.addProblemToContest(selectedContest, newProblemData);
            setStatus(`Problem "${newProblem.title}" added to contest!`);
            setTitle('');
            setStatement('');
        } catch (err) {
            setStatus('Failed to add problem.');
        }
    }
    
    return (
        <div className="bg-light-surface dark:bg-dark-surface p-6 rounded-lg border border-gray-200 dark:border-royal-purple/50">
            <h2 className="text-2xl font-bold mb-4">Add Problem to Contest</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <select value={selectedContest} onChange={e => setSelectedContest(e.target.value)} required className="w-full p-2 bg-light-bg dark:bg-dark-bg rounded border border-gray-300 dark:border-royal-purple/30">
                    <option value="">Select a Contest</option>
                    {contests.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
                <input type="text" placeholder="Problem Title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 bg-light-bg dark:bg-dark-bg rounded border border-gray-300 dark:border-royal-purple/30" />
                <textarea placeholder="Problem Statement (Markdown)" value={statement} onChange={e => setStatement(e.target.value)} required className="w-full p-2 bg-light-bg dark:bg-dark-bg rounded border border-gray-300 dark:border-royal-purple/30 h-32" />
                <div className="flex gap-4">
                    <select value={difficulty} onChange={e => setDifficulty(e.target.value as any)} className="w-full p-2 bg-light-bg dark:bg-dark-bg rounded border border-gray-300 dark:border-royal-purple/30">
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                    <input type="number" placeholder="Points" value={points} onChange={e => setPoints(Number(e.target.value))} required className="w-full p-2 bg-light-bg dark:bg-dark-bg rounded border border-gray-300 dark:border-royal-purple/30" />
                </div>
                <button type="submit" className="w-full py-2 bg-royal-purple text-white font-bold rounded hover:bg-royal-purple-light">Add Problem</button>
                {status && <p className="text-center mt-2 text-yellow-500 dark:text-yellow-300">{status}</p>}
            </form>
        </div>
    );
}

export default AdminPage;