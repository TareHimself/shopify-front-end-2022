import { useCallback, useRef } from "react";

export default function useOpenAI(onResponseRecieved, engine = "text-curie - 001") {

    const currentEngine = useRef(engine);

    const sendPrompt = useCallback((prompt: String) => {
        if (!prompt.length) return "Text is too short";

        const data = {
            prompt: prompt,
            temperature: 0.5,
            max_tokens: 64,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        };


        fetch(`https://api.openai.com/v1/engines/${currentEngine.current}/completions/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
            },
            body: JSON.stringify(data),
        }).then((res) => {
            return res.json();
        }).then((res) => {
            console.log(res);
        })

    }, [])

    const changeEngine = useCallback((newEngine) => {
        currentEngine.current = newEngine;
    }, [])

    return [sendPrompt, changeEngine];
}