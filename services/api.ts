import { Contest, Problem, User, Role, Submission, Ranking, Verdict } from '../types';

// --- Mock Database ---
const MOCK_USERS: User[] = [
    { id: 'user-1', username: 'TheLurker', email: 'user@royaljudge.com', role: Role.USER, verified: true, contestHistory: [{ contestId: 'c1', rank: 3 }] },
    { id: 'user-2', username: 'CodeMaster', email: 'admin@royaljudge.com', role: Role.ADMIN, verified: true, contestHistory: [{ contestId: 'c1', rank: 1 }] },
];

const MOCK_UNVERIFIED_USERS: { user: User, code: string }[] = [];

// Problems and Contests remain the same
const MOCK_PROBLEMS: Problem[] = [
    { id: 'p1', title: 'A+B Problem', statement: 'Given two integers A and B, output their sum.', inputFormat: 'Two integers A and B.', outputFormat: 'The sum of A and B.', sampleCases: [{ input: '2 3', output: '5' }], tags: ['easy', 'math'], difficulty: 'Easy', points: 100 },
    { id: 'p2', title: 'Reverse a String', statement: 'Given a string S, output the reversed string.', inputFormat: 'A string S.', outputFormat: 'The reversed string S.', sampleCases: [{ input: 'hello', output: 'olleh' }], tags: ['easy', 'string'], difficulty: 'Easy', points: 100 },
    { id: 'p3', title: 'The Maze Runner', statement: 'Find a path from top-left to bottom-right in a grid.', inputFormat: 'An N x M grid.', outputFormat: 'The path as a sequence of moves.', sampleCases: [{ input: '...', output: 'DDRR' }], tags: ['medium', 'graph', 'bfs'], difficulty: 'Medium', points: 300 },
    { id: 'p4', title: 'Knights Tour', statement: 'Find a sequence of moves by a knight on a chessboard to visit every square exactly once.', inputFormat: 'The size of the chessboard N.', outputFormat: 'The path of the knight.', sampleCases: [{ input: '5', output: '...' }], tags: ['hard', 'backtracking'], difficulty: 'Hard', points: 500 },
];

const MOCK_CONTESTS: Contest[] = [
    { id: 'c1', title: 'Royal Rumble - I', description: 'The inaugural contest of Royal Judge. Prepare for battle!', startTime: new Date('2024-08-01T10:00:00Z'), endTime: new Date('2024-08-01T13:00:00Z'), problems: [MOCK_PROBLEMS[0], MOCK_PROBLEMS[1]], participants: ['user-1', 'user-2'] },
    { id: 'c2', title: 'The King\'s Gauntlet', description: 'A challenging contest for seasoned warriors.', startTime: new Date('2024-08-15T10:00:00Z'), endTime: new Date('2024-08-15T15:00:00Z'), problems: MOCK_PROBLEMS.slice(0, 3), participants: [] },
    { id: 'c3', title: 'Future Legends', description: 'A contest that is scheduled for the future.', startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), problems: MOCK_PROBLEMS, participants: [] },
];

let MOCK_SUBMISSIONS: Submission[] = [
    {id: 's1', userId: 'user-2', username: 'CodeMaster', problemId: 'p1', problemTitle: 'A+B Problem', language: 'C++', code: '#include <iostream>...', verdict: 'Accepted', submittedAt: new Date('2024-08-01T10:05:00Z')},
    {id: 's2', userId: 'user-1', username: 'TheLurker', problemId: 'p1', problemTitle: 'A+B Problem', language: 'Python', code: 'print(sum(map(int, input().split())))', verdict: 'Wrong Answer', submittedAt: new Date('2024-08-01T10:08:00Z')},
    {id: 's3', userId: 'user-1', username: 'TheLurker', problemId: 'p1', problemTitle: 'A+B Problem', language: 'Python', code: 'print(sum(map(int, input().split())))', verdict: 'Accepted', submittedAt: new Date('2024-08-01T10:10:00Z')},
    {id: 's4', userId: 'user-2', username: 'CodeMaster', problemId: 'p2', problemTitle: 'Reverse a String', language: 'C++', code: '...', verdict: 'Accepted', submittedAt: new Date('2024-08-01T10:15:00Z')},
];

const MOCK_JUDGE_QUEUE: Submission[] = [];

// --- Mock Judge Engine ---
const processJudgeQueue = () => {
    if (MOCK_JUDGE_QUEUE.length === 0) return;
    const submission = MOCK_JUDGE_QUEUE.shift();
    if (!submission) return;
    const dbSubmission = MOCK_SUBMISSIONS.find(s => s.id === submission.id);
    if (!dbSubmission) return;
    dbSubmission.verdict = 'Compiling';
    setTimeout(() => {
        dbSubmission.verdict = 'Running';
        setTimeout(() => {
            let finalVerdict: Verdict = 'Wrong Answer';
            if (dbSubmission.problemId === 'p1') {
                const correctPython = /a, *b *= *map\(int, *input\(\)\.split\(\)\); *print\(a *\+ *b\)/;
                const correctCpp = /#include *<iostream>[\s\S]*std::cin *>> *a *>> *b;[\s\S]*std::cout *<< *a *\+ *b;/;
                const sanitizedCode = dbSubmission.code.replace(/\s+/g, ' ');
                if (dbSubmission.language === 'Python' && correctPython.test(sanitizedCode)) finalVerdict = 'Accepted';
                else if (dbSubmission.language === 'C++' && correctCpp.test(sanitizedCode.replace(/int main\(\) *{ *int a, *b;/, ''))) finalVerdict = 'Accepted';
            } else {
                const verdicts: Verdict[] = ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error'];
                finalVerdict = verdicts[Math.floor(Math.random() * verdicts.length)];
            }
            dbSubmission.verdict = finalVerdict;
        }, 2500);
    }, 1500);
};
setInterval(processJudgeQueue, 1000);
// --- End Mock Judge Engine ---

const simulateDelay = <T,>(data: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(data), 500));

// Mock JWT logic
const createToken = (user: User) => `mock_token_for_${user.id}_${user.role}`;
const parseToken = (token: string): { userId: string, role: Role } | null => {
    const parts = token.split('_');
    if (parts.length >= 4 && parts[0] === 'mock' && parts[1] === 'token') {
        return { userId: parts[3], role: parts[4] as Role };
    }
    return null;
}

export const api = {
    // Auth
    login: (email: string, pass: string) => {
        const user = MOCK_USERS.find(u => u.email === email);
        if (user) {
            if (!user.verified) {
                return Promise.reject(new Error("Email not verified. Please check your inbox."));
            }
            return simulateDelay({ user, token: createToken(user) });
        }
        return Promise.reject(new Error("Invalid credentials"));
    },
    signup: (username: string, email: string, pass: string) => {
        if (MOCK_USERS.some(u => u.email === email) || MOCK_UNVERIFIED_USERS.some(uv => uv.user.email === email)) {
            return Promise.reject(new Error("Email already exists"));
        }
        const newUser: User = { id: `user-${Date.now()}`, username, email, role: Role.USER, verified: false, contestHistory: [] };
        // In a real app, an email would be sent. Here we use a fixed code for the demo.
        const verificationCode = '123456'; 
        MOCK_UNVERIFIED_USERS.push({ user: newUser, code: verificationCode });
        console.log(`Verification code for ${email} is ${verificationCode}`);
        return simulateDelay({ success: true, message: 'Signup successful. Please verify your email.' });
    },
    verifyEmail: (email: string, code: string) => {
        const unverifiedUserIndex = MOCK_UNVERIFIED_USERS.findIndex(uv => uv.user.email === email);
        if (unverifiedUserIndex === -1) {
            return Promise.reject(new Error("User not found or already verified."));
        }
        
        const unverifiedEntry = MOCK_UNVERIFIED_USERS[unverifiedUserIndex];
        if (unverifiedEntry.code !== code) {
            return Promise.reject(new Error("Invalid verification code."));
        }

        const verifiedUser = { ...unverifiedEntry.user, verified: true };
        MOCK_USERS.push(verifiedUser);
        MOCK_UNVERIFIED_USERS.splice(unverifiedUserIndex, 1); // Remove from unverified list

        return simulateDelay({ user: verifiedUser, token: createToken(verifiedUser) });
    },
    verifyToken: (token: string): User | null => {
        const payload = parseToken(token);
        if (payload) {
            return MOCK_USERS.find(u => u.id === payload.userId) || null;
        }
        return null;
    },

    // Contests, Problems, Submissions, Rankings, Admin... (rest of the file is unchanged)
    getContests: () => simulateDelay(MOCK_CONTESTS),
    getContestById: (id: string) => simulateDelay(MOCK_CONTESTS.find(c => c.id === id)),
    getProblem: (contestId: string, problemId: string) => {
        const contest = MOCK_CONTESTS.find(c => c.id === contestId);
        const problem = contest?.problems.find(p => p.id === problemId);
        return simulateDelay(problem);
    },
    submitSolution: (userId: string, username: string, problemId: string, problemTitle: string, language: string, code: string) => {
        const newSubmission: Submission = {
            id: `s-${Date.now()}`,
            userId,
            username,
            problemId,
            problemTitle,
            language,
            code,
            verdict: 'Pending',
            submittedAt: new Date(),
        };
        MOCK_SUBMISSIONS.unshift(newSubmission);
        MOCK_JUDGE_QUEUE.push(newSubmission);
        return simulateDelay(newSubmission);
    },
    getSubmissionById: (submissionId: string) => {
        return simulateDelay(MOCK_SUBMISSIONS.find(s => s.id === submissionId));
    },
    getUserSubmissions: (userId: string) => simulateDelay(MOCK_SUBMISSIONS.filter(s => s.userId === userId)),
    getContestRanking: (contestId: string): Promise<Ranking[]> => {
        const contest = MOCK_CONTESTS.find(c => c.id === contestId);
        if(!contest) return simulateDelay([]);
        const contestSubmissions = MOCK_SUBMISSIONS.filter(s => contest.problems.some(p => p.id === s.problemId));
        const rankingsMap: { [userId: string]: Omit<Ranking, 'rank'> } = {};
        for (const p of contest.participants) {
            const user = MOCK_USERS.find(u => u.id === p);
            if(user) {
                rankingsMap[p] = { userId: p, username: user.username, problemsSolved: 0, penalty: 0, problemStatus: {} };
            }
        }
        contestSubmissions.sort((a, b) => a.submittedAt.getTime() - b.submittedAt.getTime());
        for(const sub of contestSubmissions) {
            const userRank = rankingsMap[sub.userId];
            if(!userRank) continue;
            if(!userRank.problemStatus[sub.problemId]) {
                userRank.problemStatus[sub.problemId] = { solved: false, attempts: 0 };
            }
            const probStatus = userRank.problemStatus[sub.problemId];
            if(probStatus.solved) continue;
            probStatus.attempts++;
            if (sub.verdict === 'Accepted') {
                probStatus.solved = true;
                userRank.problemsSolved++;
                const timePenalty = Math.floor((sub.submittedAt.getTime() - contest.startTime.getTime()) / (1000 * 60));
                userRank.penalty += timePenalty + (probStatus.attempts - 1) * 20;
            }
        }
        const sortedRankings = Object.values(rankingsMap).sort((a, b) => {
            if (a.problemsSolved !== b.problemsSolved) return b.problemsSolved - a.problemsSolved;
            return a.penalty - b.penalty;
        }).map((r, i) => ({ ...r, rank: i + 1 }));
        return simulateDelay(sortedRankings);
    },
    createContest: (title: string, description: string, startTime: Date, endTime: Date): Promise<Contest> => {
        const newContest: Contest = { id: `c-${Date.now()}`, title, description, startTime, endTime, problems: [], participants: [] };
        MOCK_CONTESTS.unshift(newContest);
        return simulateDelay(newContest);
    },
    addProblemToContest: (contestId: string, problem: Omit<Problem, 'id'>): Promise<Problem> => {
        const contest = MOCK_CONTESTS.find(c => c.id === contestId);
        if (!contest) return Promise.reject("Contest not found");
        const newProblem: Problem = { ...problem, id: `p-${Date.now()}` };
        contest.problems.push(newProblem);
        return simulateDelay(newProblem);
    },
};