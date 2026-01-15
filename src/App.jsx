import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import AudioPage from "./pages/audio/AudioPage";

function App() {
  return (
    <>
      <Routes>
        {/* 예시 : <Route path="/" element={<MainPage/>} /> */}
        <Route path="/" element={<MainPage />} />
        <Route path="/audio" element={<AudioPage />} />
      </Routes>
    </>
  );
}

export default App;
