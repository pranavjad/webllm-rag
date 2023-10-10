import { useState } from 'react'
import Chatbox from './components/chatbox'
import ChatScreen from './components/ChatScreen'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='p-5 w-full h-full'>
        {/* <Chatbox/> */}
        <ChatScreen />
      </div>
    </>
  )
}

export default App
