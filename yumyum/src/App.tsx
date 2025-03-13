import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import Receipt from "./pages/Receipt";

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Förhindra scrollning 
    document.body.style.overflow = "hidden";

    // Hantera bakgrundsfärger beroende på vilken sida som visas
    if (location.pathname === "/") {
      document.body.classList.add("menu-background");
      document.body.classList.remove("default-background");
    } else {
      document.body.classList.add("default-background");
      document.body.classList.remove("menu-background");
    }
  }, [location.pathname]);

  // dölja navbaren
  const hideNavbarOn = ["/", "/cart", "/order", "/receipt"];
  const showNavbar = !hideNavbarOn.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<Order />} />
        <Route path="/receipt" element={<Receipt />} />
      </Routes>
    </>
  );
};

export default App;
