"use client";
import React, { useState } from 'react';
import ResultBox from '../components/ResultBox';
import { checkGrammar } from '../lib/api';

export default function HomePage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);

  const handleCheck = async () => {
  try {
    const res = await checkGrammar(input);
    console.log("API Response:", res); // 👈 Add this
    setResult(res);
  } catch (error) {
    console.error("Error checking grammar:", error);
  }
};

  return (
    <div className="p-4 max-w-xl mx-auto">
      <textarea className="w-full p-2 border rounded" rows={4} value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleCheck} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Check Grammar</button>
      {result && <ResultBox result={result} />}
    </div>
  );
}
