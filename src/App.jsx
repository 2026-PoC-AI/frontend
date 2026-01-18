import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import MainPage from "./pages/MainPage";
import ImagePage from "./pages/image/ImagePage";
import AudioPage from "./pages/audio/AudioPage";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/image" element={<ImagePage />} />
        <Route path="/audio" element={<AudioPage />} />
      </Route>
    </Routes>
  );
}

export default App;
