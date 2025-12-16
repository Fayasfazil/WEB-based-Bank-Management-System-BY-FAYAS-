
import React, { useEffect, useRef } from 'react';
import type { ConsoleLine } from '../types';
import { ConsoleLineType } from '../types';

interface ConsoleProps {
  lines: ConsoleLine[];
}

const ConsoleLineDisplay: React.FC<{ line: ConsoleLine }> = ({ line }) => {
    switch (line.type) {
        case ConsoleLineType.COMMAND:
            return <p><span className="text-green-400 mr-2">$</span>{line.text}</p>;
        case ConsoleLineType.RESPONSE:
            return <p className="text-blue-400">{line.text}</p>;
        case ConsoleLineType.ERROR:
            return <p className="text-red-500">Error: {line.text}</p>;
        case ConsoleLineType.SYSTEM:
            return <p className="text-gray-400 whitespace-pre-wrap">{line.text}</p>;
        case ConsoleLineType.PYTHON:
            return (
                <div className="bg-gray-800 rounded-md p-3 my-2 border border-gray-700">
                    <p className="text-xs text-yellow-300 mb-2">// Generated Python Code</p>
                    <pre className="text-sm text-cyan-300 whitespace-pre-wrap"><code>{line.text}</code></pre>
                </div>
            );
        default:
            return <p>{line.text}</p>;
    }
};

const Console: React.FC<ConsoleProps> = ({ lines }) => {
  const endOfConsoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfConsoleRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  return (
    <div className="space-y-2">
      {lines.map((line) => (
        <ConsoleLineDisplay key={line.id} line={line} />
      ))}
      <div ref={endOfConsoleRef} />
    </div>
  );
};

export default Console;
