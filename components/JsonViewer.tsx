
import React from 'react';
import type { Accounts } from '../types';

interface JsonViewerProps {
  accounts: Accounts;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ accounts }) => {
  const jsonString = JSON.stringify(accounts, null, 2);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 h-full flex flex-col">
      <header className="p-3 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-gray-300">📄 accounts.json</h2>
      </header>
      <div className="p-4 overflow-auto flex-1">
        <pre className="text-sm text-gray-200 whitespace-pre-wrap">
          <code dangerouslySetInnerHTML={{ __html: syntaxHighlight(jsonString) }} />
        </pre>
      </div>
    </div>
  );
};

// Simple JSON syntax highlighter
const syntaxHighlight = (json: string) => {
    if (!json || json === '{}') return '{}';
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
        let cls = 'text-yellow-400'; // number
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'text-pink-400'; // key
            } else {
                cls = 'text-green-400'; // string
            }
        } else if (/true|false/.test(match)) {
            cls = 'text-purple-400'; // boolean
        } else if (/null/.test(match)) {
            cls = 'text-gray-500'; // null
        }
        return `<span class="${cls}">${match}</span>`;
    });
}

export default JsonViewer;
