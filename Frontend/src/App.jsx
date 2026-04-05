import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/login";
import Register from "./pages/register";
import Top from "./component/top"; // your dashboard / todo page

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/*  Default page → Register */}
        <Route path="/" element={<Navigate to="/register" />} />

        {/* 🔹 Auth */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* 🔹 Dashboard / Todo */}
        <Route path="/dashboard" element={<Top />} />

        {/* 🔹 404 */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;