import React, {useEffect, useState} from 'react'
import * as webllm from "@mlc-ai/web-llm";
import { WebPDFLoader } from "langchain/document_loaders/web/pdf";
import * as pdfjsLib from 'pdfjs-dist'
import { Document } from "langchain/document";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

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
        pdfjsLib.GlobalWorkerOptions.workerSrc = '../node_modules/pdfjs-dist/build/pdf.worker.js'
        const loadingTask = pdfjsLib.getDocument('/entr_textbook.pdf');
        // https://stackoverflow.com/questions/58728223/how-to-import-pdfjs-dist-in-angular-project-in-order-to-know-to-view-port-of-the
        const getPageText = async (pdf, pageNo) => {
            const page = await pdf.getPage(pageNo);
            const tokenizedText = await page.getTextContent();
            const pageText = tokenizedText.items.map(token => token.str).join("");
            return pageText;
        };
        loadingTask.promise.then(async (pdf) => {
            console.log(pdf);
            const maxPages = pdf.numPages;
            const pageTextPromises = [];
            for (let pageNo = 1; pageNo <= maxPages; pageNo += 1) {
                pageTextPromises.push(getPageText(pdf, pageNo));
            }
            const pageTexts = await Promise.all(pageTextPromises);
            let text = pageTexts.join(" ");
            const splitter = new RecursiveCharacterTextSplitter({
                chunkSize: 1000,
                chunkOverlap: 200,
            });
            const output = await splitter.createDocuments([text]);
            console.log(output)
        });


        // fetch("/entr_textbook.pdf").then(res => res.blob()).then(async blob => {
        //     console.log(blob)
            
        //     const loader = new WebPDFLoader(blob);
        //     const docs = await loader.load();
        //     console.log(docs);
        // })
        // const blob = new Blob(); // e.g. from a file input
        
        // const docs = loadPDF();

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
                    <div className='w-full p-2'>{response}</div>
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