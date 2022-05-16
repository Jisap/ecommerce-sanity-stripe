import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({ children }) => { // Exportamos el context para usarlo en _app.js
    const [showCart, setShowCart] = useState( false );
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState( 1 );

    let foundProduct;
    let index;

    const incQty = () => {
        setQty(( prevQty ) => prevQty + 1 ); // Establece el nuevo valor de la cantidad basado en el estado anterior + 1
    }

    const decQty = () => {                   // Establece el nuevo valor de la cantidad basado en el estado anterior - 1
        setQty(( prevQty ) => {
            if( prevQty -1 < 1 ) return 1;
            return prevQty - 1 
        }); 
    }

    const onAdd = ( product, quantity ) => {           
                                                      // item iterado // item del argumento
        const checkProductInCart = cartItems.find( (item) => item._id === product._id );  // Comprobamos si el item a añadir ya esta en el carrito 
        setTotalPrice( (prevTotalPrice) => prevTotalPrice + (product.price * quantity) ); // Establecemos el precio total. Sumamos el precio del producto al precio total
        setTotalQuantities( (prevTotalQuantities) => prevTotalQuantities + quantity );    // Establecemos la cantidad total. Sumamos la cantidad del producto al total de cantidades
        
        if( checkProductInCart ){                                       // Si si esta en el carrito
            const updateCartItems = cartItems.map( (cartProduct) => {   // Actualización de los items del carrito
                if(cartProduct._id === product._id) return {            // Localizamos en el carrito el producto que se va a actualizar (cartProduct)
                    ...cartProduct,                                     // spread de sus propiedades
                    quantity: cartProduct.quantity + quantity           // y modificamos solo la cantidad del producto   
                }                                   
            })
            
            setCartItems( updateCartItems );                            // Actualizamos el estado del carrito
            
        } else{                                                         // Sino está en el carrito el producto
            product.quantity = quantity;                                // Establecemos la cantidad del producto
            setCartItems([...cartItems, { ...product }]);               // Añadimos el producto al carrito tal como está.
        }    
        
        toast.success(`${ qty } ${ product.name } added to the cart.`);
    }

    const onRemove = ( product ) => {
        foundProduct = cartItems.find( (item) => item._id === product._id );       // Localizamos el producto que queremos borrar del carrito, 
        const newCartItems = cartItems.filter((item) => item._id !== product._id); // y lo borramos del carrito en una copia del mismo.
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity); // Restamos el precio del producto al precio total
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities - foundProduct.quantity); // Restamos la cantidad del producto al total de cantidades
        setCartItems(newCartItems);
    }

    const toggleCartItemQuantity = ( id, value ) => {
        foundProduct = cartItems.find( (item) => item._id === id );      // Localizamos el producto que queremos modificar la cantidad en el carrito, 
        index = cartItems.findIndex(( product ) => product._id === id ); // Localizamos su index en el carrito en base a su id.
        const newCartItems = cartItems.filter((item) => item._id !== id);// Eliminamos el producto de la copia del carrito para evitar duplicados
        

        if( value === 'inc'){   
            newCartItems.splice(index, 0, { ...foundProduct, quantity: foundProduct.quantity + 1, });    // Introducimos el producto en su posición cambiando la cantidad                                                  
            //setCartItems([...newCartItems, {...foundProduct, quantity: foundProduct.quantity + 1 }] ); // Actualizamos el estado del carrito. Spread de los items del carrito y añadimos uno más a la cantidad del producto 
            setCartItems(newCartItems);
            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);   // Actualizamos el precio total a pagar
            setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1);       // Actualizamos la cantidad total de productos
        }else if( value === 'dec'){
            if( foundProduct.quantity > 1) {
                newCartItems.splice(index, 0, { ...foundProduct, quantity: foundProduct.quantity - 1,});
                //setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity - 1 } ]);
                setCartItems(newCartItems);
                setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price)
                setTotalQuantities(prevTotalQuantities => prevTotalQuantities - 1)
            }
        }
    }

    return (
        <Context.Provider
            value={{
                showCart,
                cartItems,
                setCartItems,
                totalPrice,
                setTotalPrice,
                totalQuantities,
                setTotalQuantities,
                qty,
                incQty,
                decQty,
                onAdd,
                showCart,
                setShowCart,
                toggleCartItemQuantity,
                onRemove,
            }}
        >
            { children }
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context); // Función para usar el context en otros componentes
