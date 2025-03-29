import { useEffect, useState } from 'react';

function App() {
  const [advice, setAdvice] = useState('');
  const [count, setCount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function getAdvice() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.adviceslip.com/advice');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setAdvice(data.slip.advice);
      setCount((prevCount) => prevCount + 1);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch advice:', err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getAdvice();
  }, []);

  return (
    <div>
      {isLoading ? <h1>Loading advice...</h1> : <h1>{advice}</h1>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <button onClick={getAdvice} disabled={isLoading}>
        {isLoading ? 'Fetching...' : 'Get Advice'}
      </button>
      <p>
        You have read <strong>{count}</strong> advices!
      </p>
    </div>
  );
}

export default App;
