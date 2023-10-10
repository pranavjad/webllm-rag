import React, {useEffect, useState} from 'react'
import * as webllm from "@mlc-ai/web-llm";

function ChatScreen() {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [modelLoading, setModelLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const chat = new webllm.ChatModule();
    
    const handleInputChange = (e) => {
        setPrompt(e.target.value);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(prompt);
        setPrompt("");
        setChatHistory([...chatHistory, prompt]);
        getModelResponse(prompt);
        // setChatHistory([...chatHistory, reply]);
    }
    const generateProgressCallback = (_step, message) => {
        setResponse(message);
        // console.log(message);
    };
    const getModelResponse = async (prompt) => {
        setModelLoading(true);
        await chat.reload("vicuna-v1-7b-q4f32_0");
        const reply = await chat.generate(prompt, generateProgressCallback);
        setChatHistory([...chatHistory, prompt, reply]);
        setResponse("");
        setModelLoading(false);
    }
    useEffect(() => {
        chat.setInitProgressCallback((report) => {
            setLoadingMessage(report.text);
        });
        const loadModel = async () => {
            setModelLoading(true);
            await chat.reload("vicuna-v1-7b-q4f32_0");
            // setChatHistory([response]);
            // console.log(response);
            // setResponse("");
            setModelLoading(false);
        }
        loadModel();
    }, [])
    
    return (
        <div className='w-full h-full flex flex-row justify-center'>
            <div className='flex flex-col w-1/2'>
                <div className='border border-black flex-1 rounded-md mb-5 overflow-auto divide-y'>
                    {/* Chat history goes here */}
                    <div className='w-full p-2'> Loading: {loadingMessage}</div>
                    {
                        chatHistory.map((chat, idx) => {
                            return <div className='w-full p-2' key={idx}>{chat}</div>
                        })
                    }
                    <div className='w-full p-2'>Res: {response}</div>
                </div>
                <form className='w-full flex justify-center' onSubmit={handleSubmit}>
                    <input disabled={modelLoading} className='border border-slate-500 rounded-md p-2 w-full' type="text" value={prompt} onChange={handleInputChange} placeholder='Enter your prompt'/>
                    {/* <input type="submit" /> */}
                </form>
            </div>
        </div>
    )
}

export default ChatScreen