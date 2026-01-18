import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import AudioPage from "./pages/audio/AudioPage";
import { LandingPage } from "./pages/LandingPage";
import { VideoUpload } from "./features/video/components/VideoUpload";
import { VideoProgress } from "./features/video/components/VideoProgress";
import { VideoResults } from "./features/video/components/VideoResults";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/audio" element={<AudioPage />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/video" element={<VideoUpload />} />
                <Route path="/video/analyzing" element={<VideoProgress />} />
                <Route path="/video/results" element={<VideoResults />} />
            </Routes>
        </div>
    );
}

export default App;