import { useEffect, useState, useCallback, useRef } from 'react';

function App() {
  const [advice, setAdvice] = useState('');
  const [count, setCount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const lastFetchTime = useRef(0); // Track last fetch time
  const DEBOUNCE_DELAY = 1000; // 1 second delay between clicks

  const getAdvice = useCallback(async () => {
    const now = Date.now();
    // If last fetch was too recent, ignore this click
    if (now - lastFetchTime.current < DEBOUNCE_DELAY) {
      return;
    }

    lastFetchTime.current = now;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.adviceslip.com/advice');
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setAdvice(data.slip.advice);
      setCount((c) => c + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getAdvice();
  }, [getAdvice]);

  return (
    <div className="py-4">
      <div className="adivce">
        {isLoading ? (
          <h1 className="loading loading-dots loading-xl"></h1>
        ) : (
          <h1 className="text-4xl mx-2 bold">{advice}</h1>
        )}
      </div>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <button className="m-4" onClick={getAdvice} disabled={isLoading}>
        {isLoading ? 'Fetching...' : 'Get Advice'}
      </button>
      <p>
        You have read <strong>{count}</strong> advices!
      </p>
    </div>
  );
}

export default App;
