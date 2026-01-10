import "./App.css";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        {/* 예시 : <Route path="/" element={<MainPage/>} /> */}
        <Route path="/" element={<h1>App Start</h1>} />
      </Routes>
    </div>
  );
}

export default App;
