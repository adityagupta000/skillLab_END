import React from 'react';

const TokenStats = ({ totalTokens = 0, servedTokens = 0, pendingTokens = 0 }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md w-full max-w-md mx-auto my-4">
      <h2 className="text-xl font-semibold mb-4">Token Statistics</h2>
      <ul className="space-y-2">
        <li><strong>Total Tokens:</strong> {totalTokens}</li>
        <li><strong>Served Tokens:</strong> {servedTokens}</li>
        <li><strong>Pending Tokens:</strong> {pendingTokens}</li>
      </ul>
    </div>
  );
};

export default TokenStats;
