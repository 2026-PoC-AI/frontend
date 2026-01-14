import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";

function App() {
  return (
    <>
      <Routes>
        {/* 예시 : <Route path="/" element={<MainPage/>} /> */}
        <Route path="/" element={<MainPage />} />
      </Routes>
    </>
  );
}

export default App;
