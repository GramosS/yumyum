import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";//importera rootstate för att typa vår redux store
import "../styles/order.scss";
import boxTopImage from "../assets/images/boxtop.png";
import logoIcon from "../assets/images/logo.svg";

// Funktion för ETA
const formatETA = (eta: string | null): string => {
  if (!eta) return "Okänt"; // Om ETA saknas
  const etaDate = new Date(eta);
  const now = new Date();
  const diffInMinutes = Math.round((etaDate.getTime() - now.getTime()) / 60000);
  return `${diffInMinutes} MIN`; // Ex: "5 MIN"
};

const Order: React.FC = () => {
  const cart = useSelector((state: RootState) => state.cart.items);//hämta varor från redux store
  const navigate = useNavigate();//navigera mellan sidorna
  const [orderId, setOrderId] = useState<string | null>(null);// state för att hålla beställnings id
  const [eta, setEta] = useState<string | null>(null);// state för eta
  const [loading, setLoading] = useState(true);// state för laddning
  const [error, setError] = useState(false);// state för fel

  //useffect för hantera beställning
  useEffect(() => {
    const placeOrder = async () => {
      const apiKey = localStorage.getItem("apiKey");// api key från localstorage
      const tenantId = localStorage.getItem("tenantId");// hämta tenant id från localstorage

      if (!apiKey || !tenantId) { // visar fel om tenant eller api saknas
        console.error(" API-nyckel eller Tenant-ID saknas!");
        setError(true);
        setLoading(false);
        return;
      }

      if (cart.length === 0) { // om korgen är tom visa fel
        console.error(" Kundvagnen är tom!");
        setError(true);
        setLoading(false);
        return;
      }

      // array med id för att skapa order
      const order = {
        items: cart.map((item) => item.id),
      };

      console.log("📡 Skickar beställning...", JSON.stringify(order));

      try {
        const response = await fetch(
          `https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/${tenantId}/orders`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-zocom": apiKey,
            },
            body: JSON.stringify(order),
          }
        );

        const data = await response.json();
        console.log("📡 API-respons:", response.status, data);

        if (!response.ok) {
          throw new Error(` API-fel: ${response.status} - ${data.message}`);
        }

        setOrderId(data.order.id);
        setEta(data.order.eta);
      } catch (error) {
        console.error("Beställningsfel:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    placeOrder();
  }, [cart]);

  return (
    <div className="order-container">
      <img src={logoIcon} alt="Logo" className="order-logo" />
      <img src={boxTopImage} alt="Box med wontons" className="order-image" />

      {loading ? (
        <p className="order-status">Laddar beställning...</p>
      ) : error ? (
        <p className="order-status">Misslyckades att lägga beställning</p>
      ) : (
        <>
          <h2 className="order-status">DINA WONTONS TILLAGAS!</h2>
          <p className="order-eta">ETA {formatETA(eta)}</p>
          <p className="order-number">#{orderId}</p>
        </>
      )}

      <button className="order-new" onClick={() => navigate("/")}>GÖR EN NY BESTÄLLNING</button>
      <button className="order-receipt" onClick={() => navigate("/receipt")}>SE KVITTO</button>
    </div>
  );
};

export default Order;
