import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Navbar from './components/Navbar';
import PlayerBar from './components/PlayerBar';
import { SongProvider } from './context/SongContext';

function App() {
  return (
    <SongProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
        <PlayerBar />
      </BrowserRouter>
    </SongProvider>
  );
}
export default App;
