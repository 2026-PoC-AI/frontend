import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import MainPage from "./pages/MainPage";
import AudioUploadPage from "./pages/audio/AudioUploadPage";
import AudioResultPage from "./pages/audio/AudioResultPage";
import ImagePage from "./pages/image/ImagePage";
import TextPage from "./pages/text/TextPage";
import ImageHistoryPage from "./pages/image/ImageHistoryPage";
import { VideoUpload } from "./features/video/components/VideoUpload";
import { VideoProgress } from "./features/video/components/VideoProgress";
import { VideoResults } from "./features/video/components/VideoResults";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/image" element={<ImagePage />} />
        <Route path="/image/history" element={<ImageHistoryPage />} />
        <Route path="/audio" element={<AudioUploadPage />} />
        <Route path="/audio/result" element={<AudioResultPage />} />
        <Route path="/video" element={<VideoUpload />} />
        <Route path="/video/analyzing" element={<VideoProgress />} />
        <Route path="/video/results" element={<VideoResults />} />
        <Route path="/text" element={<TextPage />} />
      </Route>
    </Routes>
  );
}

export default App;
