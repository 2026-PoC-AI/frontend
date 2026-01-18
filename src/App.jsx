import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import MainPage from "./pages/MainPage";
import AudioPage from "./pages/audio/AudioPage";
import { VideoUpload } from "./features/video/components/VideoUpload";
import { VideoProgress } from "./features/video/components/VideoProgress";
import { VideoResults } from "./features/video/components/VideoResults";

function App() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route path="/" element={<MainPage />} />
                <Route path="/audio" element={<AudioPage />} />
                <Route path="/video" element={<VideoUpload />} />
                <Route path="/video/analyzing" element={<VideoProgress />} />
                <Route path="/video/results" element={<VideoResults />} />
            </Route>
        </Routes>
    );
}

export default App;