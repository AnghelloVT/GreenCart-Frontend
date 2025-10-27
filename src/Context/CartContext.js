import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // 🔄 Guardar carrito cuando cambie
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 🧠 Escuchar cambios en otras pestañas (sincronización en tiempo real)
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "cart") {
        setCart(event.newValue ? JSON.parse(event.newValue) : []);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ➕ Agregar producto
  const addToCart = (product) => {
    console.log("🟢 Agregando producto:", product);
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.productId === product.productId);
      if (existing) {
        return prevCart.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.productPrice }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1, total: product.productPrice }];
    });
  };

  // ❌ Eliminar producto
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };

  // ➖ Disminuir cantidad
  const decreaseQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1, total: (item.quantity - 1) * item.productPrice }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // 🧹 Vaciar carrito
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