import "./App.css";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Page/Home";
import Shop from "./Page/Shop";
import SignUp from "./Page/SignUp";
import About from "./Page/About";
import Security from "./Page/Security";
import Build from "./Page/Build";
import Support from "./Page/Support";
import Status from "./Page/Status";
import NotFound from "./Page/NotFound";
import AdminOrders from "./Page/AdminOrders";
import ProductInfo from "./Shop/ProductInfo";
import Checkout from "./Checkout/Checkout";

import ProtectedRoute from "./protection/ProtectedRoutes";
import { PasswordProvider } from "./protection/ProtectedPass";

function App() {
  return (
    <PasswordProvider>
      <HashRouter>
        <Routes>
          <Route path="/SignUp" element={<SignUp />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/Home" element={<Home />} />
            <Route path="/Shop" element={<Shop />} />
            <Route path="/about" element={<About />} />
            <Route path="/security" element={<Security />} />
            <Route path="/build" element={<Build />} />
            <Route path="/support" element={<Support />} />
            <Route path="/status" element={<Status />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Route>

          <Route path="/product/:id" element={<ProductInfo />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route
            path="/"
            element={<Navigate to="/Home" replace />}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </PasswordProvider>
  );
}

export default App;