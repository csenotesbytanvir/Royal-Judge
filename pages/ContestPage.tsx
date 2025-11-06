
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';
import { Contest, NavigationFunc, Problem, Submission, Ranking, Verdict } from '../types';
import { useAuth } from '../hooks/useAuth';
import CodeEditor from '../components/CodeEditor';

interface ContestPageProps {
    contestId: string;
    navigate: NavigationFunc;
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-6 py-3 font-bold text-lg transition-colors duration-300 ${
            active ? 'border-b-2 border-royal-purple dark:border-royal-gold text-royal-purple dark:text-royal-gold' : 'text-gray-500 dark:text-gray-400 hover:text-light-text dark:hover:text-white'
        }`}
    >
        {children}
    </button>
);

const ContestPage: React.FC<ContestPageProps> = ({ contestId, navigate }) => {
    const [contest, setContest] = useState<Contest | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'problems' | 'ranking' | 'submissions'>('problems');
    const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

    useEffect(() => {
        const fetchContest = async () => {
            setLoading(true);
            const data = await api.getContestById(contestId);
            setContest(data || null);
            setLoading(false);
        };
        fetchContest();
    }, [contestId]);
    
    const handleProblemSelect = (problem: Problem) => {
        setSelectedProblem(problem);
    };
    
    const handleBackToList = () => {
        setSelectedProblem(null);
    }

    if (loading) return <div className="text-center text-xl">Loading Contest...</div>;
    if (!contest) return <div className="text-center text-xl text-red-500">Contest not found.</div>;
    
    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-5xl font-bold mb-2">{contest.title}</h1>
                <p className="text-light-text-secondary dark:text-gray-400 max-w-3xl mx-auto">{contest.description}</p>
            </div>
            
             {selectedProblem ? (
                <ProblemView problem={selectedProblem} contestId={contest.id} onBack={handleBackToList} />
            ) : (
                <>
                    <div className="flex justify-center border-b border-gray-300 dark:border-royal-purple/50 mb-8">
                        <TabButton active={activeTab === 'problems'} onClick={() => setActiveTab('problems')}>Problems</TabButton>
                        <TabButton active={activeTab === 'ranking'} onClick={() => setActiveTab('ranking')}>Ranking</TabButton>
                        <TabButton active={activeTab === 'submissions'} onClick={() => setActiveTab('submissions')}>My Submissions</TabButton>
                    </div>

                    {activeTab === 'problems' && <ProblemsList problems={contest.problems} onProblemSelect={handleProblemSelect} />}
                    {activeTab === 'ranking' && <RankingTable contestId={contest.id} />}
                    {activeTab === 'submissions' && <UserSubmissions />}
                </>
            )}
        </div>
    );
};


const ProblemsList: React.FC<{ problems: Problem[], onProblemSelect: (problem: Problem) => void }> = ({ problems, onProblemSelect }) => (
    <div className="space-y-4 max-w-4xl mx-auto">
        {problems.map(problem => (
            <div key={problem.id} onClick={() => onProblemSelect(problem)} className="bg-light-surface dark:bg-dark-surface p-4 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-royal-purple/20 transition-colors border border-transparent hover:border-royal-purple dark:hover:border-transparent">
                <div>
                    <h3 className="text-xl font-bold text-royal-purple dark:text-royal-gold">{problem.title}</h3>
                    <p className="text-sm text-light-text-secondary dark:text-gray-400">Difficulty: {problem.difficulty} | Points: {problem.points}</p>
                </div>
                <span className="text-2xl text-royal-purple dark:text-gray-400">&rarr;</span>
            </div>
        ))}
    </div>
);

const ProblemView: React.FC<{ problem: Problem, contestId: string, onBack: () => void }> = ({ problem, contestId, onBack }) => {
    const { user } = useAuth();
    const [language, setLanguage] = useState('C++');
    const [code, setCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState('');
    const pollingIntervalRef = useRef<number | null>(null);
    
    const stopPolling = () => {
        if(pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }
    };

    useEffect(() => {
        return () => stopPolling(); // Cleanup on unmount
    }, []);

    const pollSubmissionStatus = (submissionId: string) => {
        pollingIntervalRef.current = window.setInterval(async () => {
            const sub = await api.getSubmissionById(submissionId);
            if (sub) {
                setSubmissionStatus(`Judging... Status: ${sub.verdict}`);
                if (sub.verdict !== 'Pending' && sub.verdict !== 'Compiling' && sub.verdict !== 'Running') {
                    stopPolling();
                     setSubmissionStatus(`Final Verdict: ${sub.verdict}`);
                    setTimeout(() => onBack(), 3000);
                }
            }
        }, 1000);
    };

    const handleSubmit = async () => {
        if (!user) {
            setSubmissionStatus("You must be logged in to submit.");
            return;
        }
        setIsSubmitting(true);
        setSubmissionStatus('Queued for judging...');
        try {
            const result = await api.submitSolution(user.id, user.username, problem.id, problem.title, language, code);
            setSubmissionStatus(`Submission received! Status: ${result.verdict}`);
            pollSubmissionStatus(result.id);
        } catch(e) {
            setSubmissionStatus('Submission failed.');
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="max-w-7xl mx-auto">
            <button onClick={onBack} className="mb-4 text-royal-purple dark:text-royal-gold hover:underline">&larr; Back to Problems</button>
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-light-surface dark:bg-dark-surface p-6 rounded-lg border border-gray-200 dark:border-royal-purple/30">
                    <h2 className="text-3xl font-bold text-royal-purple dark:text-royal-gold mb-4">{problem.title}</h2>
                    <div className="prose dark:prose-invert max-w-none text-light-text dark:text-gray-300 space-y-4">
                        <p>{problem.statement}</p>
                        <h4 className="font-bold text-lg">Input Format</h4>
                        <p>{problem.inputFormat}</p>
                        <h4 className="font-bold text-lg">Output Format</h4>
                        <p>{problem.outputFormat}</p>
                        <h4 className="font-bold text-lg">Sample Cases</h4>
                        {problem.sampleCases.map((sc, i) => (
                            <div key={i} className="space-y-2">
                                <p className="font-mono font-bold">Sample {i + 1}:</p>
                                <pre className="bg-gray-100 dark:bg-dark-bg p-2 rounded-md"><strong>Input:</strong><br/>{sc.input}</pre>
                                <pre className="bg-gray-100 dark:bg-dark-bg p-2 rounded-md"><strong>Output:</strong><br/>{sc.output}</pre>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <CodeEditor language={language} onLanguageChange={setLanguage} code={code} onCodeChange={setCode} problemId={problem.id} />
                    <button onClick={handleSubmit} disabled={isSubmitting || !code} className="mt-4 w-full py-3 font-bold text-dark-bg bg-royal-gold rounded-lg hover:bg-royal-gold-dark transition-colors disabled:bg-gray-600">
                        {isSubmitting ? 'Processing...' : 'Submit Code'}
                    </button>
                    {submissionStatus && <p className="mt-4 text-center text-yellow-500 dark:text-yellow-400 animate-pulse-fast">{submissionStatus}</p>}
                </div>
            </div>
        </div>
    );
};

const RankingTable: React.FC<{ contestId: string }> = ({ contestId }) => {
    const [rankings, setRankings] = useState<Ranking[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRankings = useCallback(async () => {
        // Only show loader on first fetch
        if(rankings.length === 0) setLoading(true);
        const data = await api.getContestRanking(contestId);
        setRankings(data);
        setLoading(false);
    }, [contestId, rankings.length]);

    useEffect(() => {
        fetchRankings();
        const interval = setInterval(fetchRankings, 30000); // Auto-refresh every 30 seconds
        return () => clearInterval(interval);
    }, [fetchRankings]);

    if(loading) return <p>Loading rankings...</p>;
    
    return (
        <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-lg border border-gray-200 dark:border-royal-purple/30 overflow-x-auto">
            <table className="w-full min-w-max font-mono text-center">
                <thead>
                    <tr className="border-b border-gray-300 dark:border-royal-purple/50">
                        <th className="p-3">#</th>
                        <th className="p-3 text-left">User</th>
                        <th className="p-3">Solved</th>
                        <th className="p-3">Penalty</th>
                    </tr>
                </thead>
                <tbody>
                    {rankings.map(r => (
                        <tr key={r.userId} className="border-b border-gray-200 dark:border-royal-purple/20 hover:bg-gray-100 dark:hover:bg-royal-purple/10">
                            <td className="p-3 font-bold">{r.rank}</td>
                            <td className="p-3 text-left text-royal-purple dark:text-royal-gold">{r.username}</td>
                            <td className="p-3">{r.problemsSolved}</td>
                            <td className="p-3">{r.penalty}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const UserSubmissions: React.FC = () => {
    const { user } = useAuth();
    const [submissions, setSubmissions] = useState<Submission[]>([]);

    const fetchSubmissions = useCallback(async () => {
        if (user) {
            const data = await api.getUserSubmissions(user.id);
            setSubmissions(data);
        }
    }, [user]);

    useEffect(() => {
        fetchSubmissions();
        const interval = setInterval(fetchSubmissions, 2000); // Refresh submissions every 2 seconds
        return () => clearInterval(interval);
    }, [fetchSubmissions]);

    if (!user) return <p>Please log in to see your submissions.</p>;
    if (submissions.length === 0) return <p>You have no submissions for this contest yet.</p>;

    const getVerdictColor = (verdict: Submission['verdict']) => {
        switch (verdict) {
            case 'Accepted': return 'text-green-600 dark:text-green-400';
            case 'Wrong Answer':
            case 'Runtime Error':
            case 'Compilation Error':
                 return 'text-red-600 dark:text-red-400';
            case 'Time Limit Exceeded': return 'text-yellow-600 dark:text-yellow-400';
            case 'Compiling':
            case 'Running':
                 return 'text-blue-500 dark:text-cyber-blue animate-pulse';
            default: return 'text-gray-600 dark:text-gray-400';
        }
    };
    
    return (
        <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-lg border border-gray-200 dark:border-royal-purple/30">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-gray-300 dark:border-royal-purple/50 font-mono">
                        <th className="p-2">Problem</th>
                        <th className="p-2">Language</th>
                        <th className="p-2">Verdict</th>
                        <th className="p-2">Time</th>
                    </tr>
                </thead>
                <tbody>
                    {submissions.map(s => (
                        <tr key={s.id} className="border-b border-gray-200 dark:border-royal-purple/20">
                            <td className="p-2">{s.problemTitle}</td>
                            <td className="p-2">{s.language}</td>
                            <td className={`p-2 font-bold ${getVerdictColor(s.verdict)}`}>{s.verdict}</td>
                            <td className="p-2 text-sm text-light-text-secondary dark:text-gray-400">{s.submittedAt.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export default ContestPage;