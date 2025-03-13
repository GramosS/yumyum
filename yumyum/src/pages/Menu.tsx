import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"; 
import { useNavigate } from "react-router-dom";
import { addItem } from "../store/store"; // Importera action för att lägga till en vara i varukorgen
import { getApiKey } from "../utils/api"; // Funktion för att hämta API-nyckel
import "../styles/menu.scss";
import cartIcon from "../assets/images/Union.svg";
import logoIcon from "../assets/images/logo.svg";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  type: string;
}

const Menu: React.FC = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);// state för att hålla koll på meny
  const [loading, setLoading] = useState(true);// state för att hantera laddning
  const [error, setError] = useState(false);// state för fel
  const dispatch = useDispatch(); //metod för att skicka actions
  const navigate = useNavigate(); // kunna navigera mellan sidorna

  
  const cartItems = useSelector((state: any) => state.cart.items); // hämtar varor i varukorgen från redux store
  const totalItems = cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0); // räknar total antal varor

   //useffect för att hämta meny från api
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        let apiKey = localStorage.getItem("apiKey");// hämta api nyckel från localstorage
        if (!apiKey) {
          apiKey = await getApiKey();// hämta api från getapikey funktion
        }
        if (!apiKey) throw new Error("API-nyckel saknas!");// api felkod
        //api anrop för att hämta meny
        const response = await fetch("https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu", {
          method: "GET",
          headers: { "x-zocom": apiKey },
        });

        const data = await response.json();
        if (!data || !data.items) {
          throw new Error("Felaktigt API-svar!");
        }
        //filtrera bort dryckerna 
        const filteredMenu = Array.isArray(data.items)
          ? data.items.filter((item: MenuItem) => item.type !== "drink")
          : [];

        setMenu(filteredMenu);
      } catch (error) {
        console.error("API Error:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return (
    <div className="menu-container">
      <img src={logoIcon} alt="Logo" className="logo-icon" />

      <button className="cart-button" onClick={() => navigate("/cart")}>
        <img src={cartIcon} alt="Varukorg" />
        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>} {/* Lägg till badge */}
      </button>

      <h1 className="menu-title">MENY</h1>
      {loading ? (
        <p className="loading-text">Laddar meny...</p>
      ) : error ? (
        <p className="error-text">Kunde inte ladda menyn. Försök igen senare.</p>
      ) : (
        <>
          <ul className="menu-list">
            {menu
              .filter((item) => item.type === "wonton")
              .map((item) => (
                <li 
                  key={item.id} 
                  className="menu-item"
                  onClick={() => dispatch(addItem({ ...item, quantity: 1 }))}
                >
                  <div className="menu-text">
                    <h2>{item.name}</h2>
                    <p>{item.description || "Ingen beskrivning tillgänglig"}</p>
                  </div>
                  <span className="menu-price">{item.price} SEK</span>
                </li>
              ))}
          </ul>

          <div className="dips-container">
            <h2 className="menu-title2">Dipsåsar</h2>
            <div className="dip-buttons">
              {menu
                .filter((item) => item.type === "dip")
                .map((item) => (
                  <button
                    key={item.id}
                    className="dip-button"
                    onClick={() => dispatch(addItem({ ...item, quantity: 1 }))}
                  >
                    {item.name}
                  </button>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Menu;
