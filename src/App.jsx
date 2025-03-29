import { useEffect } from 'react';
import { useState } from 'react';

function App() {
  const [advice, setAdvice] = useState('');
  const [count, setCount] = useState(0);

  async function getAdvice() {
    const response = await fetch('https://api.adviceslip.com/advice');
    const data = await response.json();
    setAdvice(data.slip.advice);
    setCount((c) => c + 1);
  }

  useEffect(() => getAdvice, []);

  return (
    <div>
      <h1>{advice}</h1>
      <button onClick={() => getAdvice()}>Get Advice</button>
      <p>
        You have read <strong>{count}</strong> advices!
      </p>
    </div>
  );
}

export default App;
