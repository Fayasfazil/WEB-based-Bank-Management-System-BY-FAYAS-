
import React from 'react';

const BankIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="18" height="11" x="3" y="10" rx="2" ry="2" />
    <path d="m7 10-4 4" />
    <path d="m17 10 4 4" />
    <path d="M3 10V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v5" />
    <path d="M12 10V3" />
  </svg>
);

export default BankIcon;
