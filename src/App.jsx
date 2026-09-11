import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Page/Home";
import Shop from "./Page/Shop";
import SignUp from "./Page/SignUp";
import About from "./Page/About";
import ProductInfo from "./Shop/ProductInfo";
import Checkout from "./Checkout/Checkout";
import ProtectedRoute from "./protection/ProtectedRoutes";
import { PasswordProvider } from "./protection/ProtectedPass";
// import { AuthProvider } from "./protection/AuthContext";

function App() {
  return (
    <PasswordProvider>
      <BrowserRouter>
        <Routes>
          {/* Login & Signup form */}
          <Route path="/SignUp" element={<SignUp />} />

          {/* Users must be logged in to view these */}
          <Route element={<ProtectedRoute />}>
            <Route path="/Home" element={<Home />} />
          </Route>

          {/* Redirect any unknown paths goes to login */}
          <Route path="*" element={<Navigate to="/SignUp" replace />} />

          {/* Directs users to About Page */}
          <Route element={<ProtectedRoute />}>
            <Route path="/About" element={<About />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/Shop" element={<Shop />} />
          </Route>

          <Route path="/product/:id" element={<ProductInfo />} />

          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </BrowserRouter>
    </PasswordProvider>
  );
}

export default App;
