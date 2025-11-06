
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-light-surface/50 dark:bg-dark-surface/30 border-t border-gray-200 dark:border-royal-purple/30 mt-12 py-6">
            <div className="container mx-auto px-4 text-center text-light-text-secondary dark:text-gray-500">
                <p>&copy; {new Date().getFullYear()} Royal Judge. All rights are reserved by Tanvir.</p>
            </div>
        </footer>
    );
};

export default Footer;