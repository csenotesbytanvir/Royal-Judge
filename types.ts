export enum Role {
    USER = 'user',
    ADMIN = 'admin',
}

export interface User {
    id: string;
    username: string;
    email: string;
    role: Role;
    verified: boolean;
    contestHistory: { contestId: string; rank: number }[];
}

export interface Problem {
    id: string;
    title: string;
    statement: string; // Markdown
    inputFormat: string;
    outputFormat:string;
    sampleCases: { input: string; output: string }[];
    tags: string[];
    difficulty: 'Easy' | 'Medium' | 'Hard';
    points: number;
}

export interface Contest {
    id: string;
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    problems: Problem[];
    participants: string[]; // user ids
}

export type Verdict = 'Pending' | 'Compiling' | 'Running' | 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compilation Error';

export interface Submission {
    id: string;
    userId: string;
    username: string;
    problemId: string;
    problemTitle: string;
    language: string;
    code: string;
    verdict: Verdict;
    submittedAt: Date;
}

export interface Ranking {
    rank: number;
    userId: string;
    username: string;
    problemsSolved: number;
    penalty: number;
    problemStatus: { [problemId: string]: { solved: boolean; attempts: number } };
}

export type PageName = 'home' | 'auth' | 'contests' | 'contest' | 'profile' | 'admin' | 'verify-email';

export type Page = 
  | { name: 'home' }
  | { name: 'auth' }
  | { name: 'contests' }
  | { name: 'contest', contestId: string }
  | { name: 'profile' }
  | { name: 'admin' }
  | { name: 'verify-email', email: string };

export type PageNav = PageName | Page;

export type NavigationFunc = (page: PageNav) => void;

export type Theme = 'light' | 'dark';