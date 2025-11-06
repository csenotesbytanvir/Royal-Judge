
import React, { useEffect } from 'react';

interface CodeEditorProps {
    language: string;
    onLanguageChange: (lang: string) => void;
    code: string;
    onCodeChange: (code: string) => void;
    problemId: string;
}

const LANGUAGES = ["C++", "Java", "Python", "JavaScript"];

const getBoilerplate = (language: string, problemId: string): string => {
    switch(problemId) {
        case 'p1': // A+B Problem
             switch(language) {
                case 'C++':
                    return '#include <iostream>\n\nint main() {\n    int a, b;\n    std::cin >> a >> b;\n    std::cout << a + b << std::endl;\n    return 0;\n}';
                case 'Python':
                    return 'a, b = map(int, input().split())\nprint(a + b)';
                case 'Java':
                    return 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(a + b);\n    }\n}';
                case 'JavaScript':
                     return `const readline = require('readline');\nconst rl = readline.createInterface({ input: process.stdin, output: process.stdout });\nrl.on('line', (line) => {\n    const [a, b] = line.split(' ').map(Number);\n    console.log(a + b);\n    rl.close();\n});`;
            }
    }
    return ''; // Default empty
}


const CodeEditor: React.FC<CodeEditorProps> = ({ language, onLanguageChange, code, onCodeChange, problemId }) => {
   
    useEffect(() => {
        onCodeChange(getBoilerplate(language, problemId));
    }, [language, problemId]);
   
    return (
        <div className="bg-light-surface dark:bg-dark-surface rounded-lg border border-gray-300 dark:border-royal-purple/50 overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 dark:bg-dark-bg/50 border-b border-gray-300 dark:border-royal-purple/50">
                <select 
                    value={language} 
                    onChange={(e) => onLanguageChange(e.target.value)}
                    className="bg-transparent font-mono text-royal-purple dark:text-royal-gold focus:outline-none"
                >
                    {LANGUAGES.map(lang => <option key={lang} value={lang} className="bg-light-surface dark:bg-dark-surface text-light-text dark:text-white">{lang}</option>)}
                </select>
            </div>
            <textarea
                value={code}
                onChange={(e) => onCodeChange(e.target.value)}
                className="w-full h-96 p-4 font-mono text-base bg-light-surface dark:bg-dark-surface text-light-text dark:text-gray-200 resize-y focus:outline-none"
                placeholder="Enter your code here..."
                spellCheck="false"
            />
        </div>
    );
};

export default CodeEditor;