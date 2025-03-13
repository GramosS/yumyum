import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/receipt.scss";
import logoIcon from "../assets/images/logo.svg";

const Receipt: React.FC = () => {
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState<any>(null);
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchReceipt = async () => {
      const apiKey = localStorage.getItem("apiKey");
      const tenantId = localStorage.getItem("tenantId");

      if (!apiKey || !tenantId) {
        console.error(" API-nyckel eller Tenant-ID saknas!");
        setError(true);
        setLoading(false);
        return;
      }

      try {
        //  Hämta menyn först för att få priserna
        const menuResponse = await fetch("https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu", {
          method: "GET",
          headers: { "x-zocom": apiKey },
        });
        const menuData = await menuResponse.json();
        setMenu(menuData.items);

        //  Hämta senaste ordern
        const orderResponse = await fetch(`https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/${tenantId}/orders`, {
          method: "GET",
          headers: { "x-zocom": apiKey },
        });
        const orderData = await orderResponse.json();

        if (!orderResponse.ok || !orderData.orders || orderData.orders.length === 0) {
          throw new Error(" Inga tidigare ordrar hittades!");
        }

        const latestOrder = orderData.orders.sort((a: { timestamp: string | number | Date; }, b: { timestamp: string | number | Date; }) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

        console.log("Senaste ordern:", JSON.stringify(latestOrder, null, 2));
        console.log(" Meny:", JSON.stringify(menuData.items, null, 2));

        setReceipt(latestOrder);
      } catch (error) {
        console.error(" Fel vid hämtning av kvitto:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, []);

  // Funktion för att hitta priset från menyn
  const getPrice = (itemId: number) => {
    console.log("🔎 Söker pris för ID:", itemId);
    const menuItem = menu.find((menuItem) => menuItem.id === itemId);
    console.log("🔍 Hittad produkt i meny:", menuItem);
    return menuItem ? menuItem.price : 0; // Returnera 0 om priset saknas
  };

  return (
    <div className="receipt-container">
      <img src={logoIcon} alt="Logo" className="receipt-logo" />

      {loading ? (
        <p className="receipt-status">Laddar kvitto...</p>
      ) : error || !receipt ? (
        <p className="receipt-status">Ingen beställning hittades.</p>
      ) : (
        <div className="receipt-box">
          <img src={logoIcon} alt="Logo" className="receipt-box-logo" />
          <h2>KVITTO</h2>
          <p className="receipt-id">#{receipt.id}</p>

          <div className="receipt-items">
            {receipt.items.map((item: any, index: number) => (
              <div key={index} className="receipt-item">
                <div className="item-info">
                  <span className="item-name">{item.name ? item.name.toUpperCase() : "Okänd vara"}</span>
                  <br />
                  <span className="item-quantity">{item.quantity ? item.quantity : 1} stycken</span>
                </div>
                <span className="item-price">{getPrice(item.id) * (item.quantity ? item.quantity : 1)} SEK</span>
              </div>
            ))}
          </div>

          <div className="receipt-total">
            <span>TOTALT</span>
            <span>{receipt.orderValue ? receipt.orderValue : "0"} SEK</span>
          </div>
          <p className="receipt-tax">inkl 20% moms</p>
        </div>
      )}

      <button className="receipt-new-order" onClick={() => navigate("/")}>
        GÖR EN NY BESTÄLLNING
      </button>
    </div>
  );
};

export default Receipt;
