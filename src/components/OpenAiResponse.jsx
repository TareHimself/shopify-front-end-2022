import React from 'react'

export default function OpenAiResponse({ data }) {
    return (
        <li className='openai-response'>
            <span><h3>{new Date(data.date).toLocaleString()}</h3><h3>{data.engine}</h3></span>
            <p>{data.response}</p>
        </li>
    )
}
