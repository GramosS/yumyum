import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, removeItem } from "../store/store";
import "../styles/cart.scss";
import cartIcon from "../assets/images/Union.svg";

const Cart: React.FC = () => {
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Räknar totalpris beställningen
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    //varukorg ikonen
    <div className="cart-container"> /
      <img src={cartIcon} alt="Varukorg" className="cart-icon" />

      <ul className="cart-list">
        {cart.map((item) => (
          <li key={item.id} className="cart-item">
            <span className="cart-item-name">{item.name}</span>
            <span className="cart-item-price">{item.price * item.quantity} SEK</span>
            <button className="remove-button" onClick={() => dispatch(removeItem(item.id))}>
              Ta bort
            </button>
          </li>
        ))}
      </ul>
        
      <div className="cart-footer">
        <div className="cart-total">
          <span>TOTALT</span>
          <span className="cart-total-price">{totalPrice} SEK</span>
        </div>
        <button className="checkout-button" onClick={() => navigate("/order")}>
          TAKE MY MONEY!
        </button>
      </div>
    </div>
  );
};

export default Cart;
