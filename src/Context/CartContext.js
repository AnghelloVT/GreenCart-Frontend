import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "cart") {
        setCart(event.newValue ? JSON.parse(event.newValue) : []);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const addToCart = async (product) => {
  // Traer stock real desde backend
  const res = await fetch(`https://greencart-backend-085d.onrender.com/productos/${product.productId}`);
  const productActual = await res.json();

  setCart((prevCart) => {
    const existing = prevCart.find((item) => item.productId === product.productId);

    if (existing) {
      if (existing.quantity + 1 > productActual.productStock) {
        alert(`❌ No puedes agregar más de ${product.productName}. Stock disponible: ${productActual.productStock}`);
        return prevCart; // no agrega
      }
      return prevCart.map((item) =>
        item.productId === product.productId
          ? {
              ...item,
              quantity: item.quantity + 1,
              total: (item.quantity + 1) * (item.productPrice || 0)
            }
          : item
      );
    }

    if (productActual.productStock < 1) {
      alert(`❌ ${product.productName} está agotado`);
      return prevCart;
    }
      return [...prevCart, { 
        ...product, 
        quantity: 1, 
        total: product.productPrice || 0 
      }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };

  const decreaseQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.productId === productId
            ? { 
                ...item, 
                quantity: item.quantity - 1, 
                total: (item.quantity - 1) * (item.productPrice || 0) 
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, decreaseQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
