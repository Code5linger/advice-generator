import { useEffect, useState, useCallback, useRef } from 'react';

// AdviceDisplay
export const AdviceDisplay = ({ advice, isLoading, error }) => {
  if (isLoading) {
    return <h1 className="loading loading-dots loading-xl mx-4"></h1>;
  }

  if (error) {
    return (
      <h1
        className="text-4xl mx-2 bold"
        style={{ color: 'red', margin: '1rem 0' }}
      >
        Error: {error}
      </h1>
    );
  }

  return <h1 className="text-4xl mx-2 bold">{advice}</h1>;
};

// AdviceButton
export const AdviceButton = ({ onClick, isLoading, isError }) => {
  return (
    <button className="m-4" onClick={onClick} disabled={isLoading}>
      {isError ? 'Retry' : isLoading ? 'Fetching...' : 'Get Advice'}
    </button>
  );
};

// AdviceCounter
export const AdviceCounter = ({ count }) => {
  return (
    <p>
      You have read <strong>{count}</strong> pieces of advice!
    </p>
  );
};

export default function App() {
  const [advice, setAdvice] = useState('');
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const lastFetchTime = useRef(0); // Track last fetch time
  const DEBOUNCE_DELAY = 1000; // 1 second delay between clicks

  const getAdvice = useCallback(async () => {
    const now = Date.now();
    if (now - lastFetchTime.current < DEBOUNCE_DELAY) {
      return;
    }

    setIsButtonDisabled(true);
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
      setTimeout(() => setIsButtonDisabled(false), DEBOUNCE_DELAY);
    }
  }, []);

  useEffect(() => {
    getAdvice();
  }, [getAdvice]);

  return (
    <div className="py-4">
      <div className="advice">
        {isLoading ? (
          <h1 className="loading loading-dots loading-xl"></h1>
        ) : (
          <AdviceDisplay advice={advice} isLoading={isLoading} error={error} />
        )}
      </div>

      <AdviceButton
        onClick={getAdvice}
        disabled={isLoading || isButtonDisabled}
        isError={!!error}
      />

      <AdviceCounter count={count} />
    </div>
  );
}
