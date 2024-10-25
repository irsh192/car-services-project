import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';  

export const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const { isLoggedIn } = useAuth();
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

    const addToCart = (productId, quantity) => {
        if (!isLoggedIn) {
            // Redirect to login if not logged in
            window.location.href = '/signin';
            return;
        }
        const itemIndex = cart.findIndex(item => item.productId === productId);
        let updatedCart = [...cart];

        if (itemIndex > -1) {
            updatedCart[itemIndex] = {
                ...updatedCart[itemIndex],
                quantity: updatedCart[itemIndex].quantity + quantity
            };
        } else {
            updatedCart.push({ productId, quantity });
        }

        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };
    const updateCart = (productId, quantity) => {
        const itemIndex = cart.findIndex(item => item.productId === productId);
        let updatedCart = [...cart];

        if (itemIndex > -1) {
            if (quantity > 0) {
                updatedCart[itemIndex].quantity = quantity;
            } else {
                updatedCart.splice(itemIndex, 1); // Remove the item completely if quantity is 0 or less
            }
        }
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };
    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
    };
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateCart, clearCart, totalItems }}>
            {children}
        </CartContext.Provider>
    );
};
