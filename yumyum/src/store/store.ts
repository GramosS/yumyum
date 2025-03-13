import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

//enskild vara i varukorgen
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
// varukorgen
interface CartState {
  items: CartItem[];
}

//varukorgen startar tom
const initialState: CartState = { items: [] };

//slice för att hantera varukorgens tillstånd
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // lägga till varor i korgen
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;// om vara finns öka med 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 }); // om varan ej finns lägg till den med 1
      }
    },
    // ta bort varor
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addItem, removeItem } = cartSlice.actions;
// skapa redux store och koppla till varukorgen 
const store = configureStore({ reducer: { cart: cartSlice.reducer } });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

//exporterar store så den funkar i hemsidan
export default store;