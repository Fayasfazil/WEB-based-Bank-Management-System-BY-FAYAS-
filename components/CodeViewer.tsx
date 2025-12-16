import React, { useState } from 'react';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface CodeViewerProps {
    code: string;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ code }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="bg-gray-900/50 rounded-xl border border-amber-500/10 overflow-hidden backdrop-blur-sm mt-4">
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex justify-between items-center p-3 bg-gray-900/70 hover:bg-gray-900 transition-colors"
                aria-expanded={isExpanded}
                aria-controls="code-panel"
            >
                <p className="text-sm font-semibold text-yellow-300">// Generated Python Code</p>
                <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
            {isExpanded && (
                <div id="code-panel" className="p-4 bg-black/50">
                    <pre className="text-sm text-cyan-300 whitespace-pre-wrap custom-scrollbar">
                        <code>{code}</code>
                    </pre>
                </div>
            )}
        </div>
    );
};

export default CodeViewer;