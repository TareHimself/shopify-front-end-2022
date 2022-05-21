import { useCallback, useState, useRef, useEffect } from 'react';
import OpenAiResponse from './components/OpenAiResponse';
const { Configuration, OpenAIApi } = require("openai");

const availableEngines = ["text-curie-001", "text-babbage-001", "text-ada-001"]

export default function App() {

    const isFirstOpen = useRef(true);

    const [responses, setResponses] = useState([]);

    const [currentEngine, setCurrentEngine] = useState(0);

    const openAi = useRef(undefined);

    const sendPrompt = useCallback(async (prompt) => {
        if (!prompt.length) return "Text is too short";

        if (!openAi.current) {
            openAi.current = new OpenAIApi(new Configuration({
                apiKey: process.env.REACT_APP_OPENAI_API_KEY,
            }));
        }

        const response = await openAi.current.createCompletion(availableEngines[currentEngine], {
            prompt: prompt,
            temperature: 0.5,
            max_tokens: 64,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });

        const newResponses = [{
            response: response?.data?.choices[0]?.text || "Error fetching a response",
            date: new Date().getTime(),
            engine: availableEngines[currentEngine],
            prompt: prompt
        }, ...responses]

        setResponses(newResponses);

        localStorage.setItem('responses', JSON.stringify(newResponses));

    }, [currentEngine, responses])

    const onChangeEngine = useCallback(() => {
        if (availableEngines.length - 1 < currentEngine + 1) {
            setCurrentEngine(0);
        }
        else {
            setCurrentEngine(currentEngine + 1);
        }
    }, [currentEngine])

    const onConfirmPrompt = useCallback((e) => {
        e.preventDefault();
        const prompt = document.getElementById('prompt-text').value;

        if (prompt) {
            sendPrompt(prompt);
        }
    }, [sendPrompt])

    useEffect(() => {
        if (isFirstOpen.current) {
            if (localStorage.getItem('responses')) {
                const savedResponses = JSON.parse(localStorage.getItem('responses'));
                setResponses(savedResponses);
            }

            isFirstOpen.current = false;
        }
    }, [isFirstOpen, responses])

    return (
        <div className="App">
            <form id="send-prompt" onSubmit={onConfirmPrompt}>
                <label htmlFor="prompt-text">
                    <textarea id='prompt-text' placeholder={`Type out text to send to "${availableEngines[currentEngine]}" engine.`} />
                </label>
                <span><div id='change-engine'><button onClick={onChangeEngine}>{availableEngines[currentEngine]}</button></div><input type="submit" value="Submit" /></span>

            </form>

            <ol className='openai-responses'>
                {responses.map(item => <OpenAiResponse data={item} key={item.date} />)}
            </ol>
        </div>
    );
}