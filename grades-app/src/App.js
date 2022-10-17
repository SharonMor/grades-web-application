import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavBar from "./NavBar";
import HomePage from "./pages/HomePage";
import StatisticsPage from "./pages/StatisticsPage";
import NotFoundPage from "./pages/NotFoundPage";
import GradesPage from "./pages/GradesPage";
import LoginPage from "./pages/LoginPage";
import CreateAccountPage from "./pages/CreateAccountPage";
import WelcomeGoogleAccount from "./pages/WelcomeGoogleAccount";

function App() {
  return (
    <BrowserRouter>
      <div className=" App">
        <div className=" relative z-20">
          <NavBar />
        </div>
        <div className="relative  p-20 z-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/grades" element={<GradesPage />} />
            <Route path="/grades/welcome" element={<WelcomeGoogleAccount />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create-account" element={<CreateAccountPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
