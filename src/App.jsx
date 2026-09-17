import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import HostRoom from './pages/HostRoom'
import JoinRoom from './pages/JoinRoom'
import SocketProvider from './context/SocketContext'
import Lobby from './pages/Lobby'
import QuestionSets from './pages/QuestionSets'
import Questions from './pages/Questions'
import WaitingRoom from './pages/WaitingRoom'
import QuestionsReview from './pages/QuestionsReview'
import Results from './pages/Results'

function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/host" element={<HostRoom />} />
          <Route path="/join" element={<JoinRoom />} />
          <Route path="/lobby/:roomCode" element={<Lobby />} />
          <Route path="/question-sets/:roomCode" element={<QuestionSets/>} />
          <Route path="/questions/:roomCode" element={<Questions/>} />
          <Route path="/waiting-room/:roomCode" element={<WaitingRoom/>} />
          <Route path="/questions-review/:roomCode" element={<QuestionsReview/>} />
          <Route path="/results/:roomCode" element={<Results/>} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  )
}

export default App
