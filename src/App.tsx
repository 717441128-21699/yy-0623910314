import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Config from "@/pages/Config";
import Monitor from "@/pages/Monitor";
import Review from "@/pages/Review";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Config />} />
        <Route path="/monitor" element={<Monitor />} />
        <Route path="/review" element={<Review />} />
      </Routes>
    </Router>
  );
}
