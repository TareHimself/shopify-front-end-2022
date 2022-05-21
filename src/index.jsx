import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import useOpenAI from './hooks/useOpenAI';
import { useCallback, useState } from 'react';
import reportWebVitals from './reportWebVitals';

function App() {

  const [responses, setResponses] = useState([]);

  const onResponseRecieved = useCallback((response) => {
    setResponses([response, ...responses])
  }, [responses, setResponses])

  const [sendPrompt, changeEngine] = useOpenAI(onResponseRecieved);

  return (
    <div className="App">
      <button onClick={() => { sendPrompt("How do i tie my shoes") }}>Request</button>
    </div>
  );
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
