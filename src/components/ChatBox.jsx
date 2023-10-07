import * as webllm from "@mlc-ai/web-llm";

import React, { useState, useEffect } from 'react'

function chatbox() {
  const [initLabel, setInitLabel] = useState("");
  const [generateLabel, setGenerateLabel] = useState("");
  const [promptLabel, setPromptLabel] = useState("");
  const [replyLabel, setReplyLabel] = useState("");
  const generateProgressCallback = (_step, message) => {
    setGenerateLabel(message);
  };
  useEffect(() => {
    const chat = new webllm.ChatModule();
    chat.setInitProgressCallback((report) => {
      setInitLabel(report.text);
    });
    const runModel = async () => {
      await chat.reload("vicuna-v1-7b-q4f32_0");

      const prompt0 = "What is the capital of Canada?";
      setPromptLabel(prompt0);
      const reply0 = await chat.generate(prompt0, generateProgressCallback);

      const prompt1 = "Can you write a poem about it?";
      setPromptLabel(prompt1);
      const reply1 = await chat.generate(prompt1, generateProgressCallback);

    }
    runModel();
    
    
  }, [])

  return (
    <div className="p-5">
      <div className="text-center text-2xl">
        WebLLM Test Page
      </div>
      <div>
        <span className="font-bold">Status:</span>
        <br />
        {initLabel}
      </div>
      <div>
        <span className="font-bold">Prompt:</span>
        <br />
        {promptLabel}
      </div>
      <div>
        <span className="font-bold">Response:</span>
        <br />
        {generateLabel}
      </div>
    </div>
  )
}

export default chatbox