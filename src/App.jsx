import { useState } from 'react'
import Chatbox from './components/chatbox'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className=''>
        <Chatbox/>
      </div>
    </>
  )
}

export default App
