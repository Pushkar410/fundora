import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreateFundraiser from "./pages/CreateFundraiser";
import Fundraiser from "./pages/Fundraiser";
import KYC from "./pages/KYC";
function App() {
  return (
    <div style={{ fontFamily: "Arial", padding: "20px" }}>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/">Home</Link> |{" "}
        <Link to="/create">Create Fundraiser</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateFundraiser />} />
        <Route path="/fundraiser/:id" element={<Fundraiser />} />
        <Route path="/kyc" element={<KYC />} />
      </Routes>
    </div>
  );
}

export default App;