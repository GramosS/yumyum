import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.scss";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Meny</Link></li>
        <li><Link to="/cart">Varukorg</Link></li>
        <li><Link to="/order">Beställ</Link></li>
        <li><Link to="/receipt">Kvitto</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
