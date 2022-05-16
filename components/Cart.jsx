import React, { useRef } from 'react';
import Link from 'next/link';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import toast from 'react-hot-toast';

import { useStateContext } from '../context/StateContext';
import { urlFor } from '../lib/client';
import getStripe from '../lib/getStripe';

const Cart = () => {

  const cartRef = useRef();
  const { totalPrice, totalQuantities, cartItems, setShowCart, toggleCartItemQuantity, onRemove } = useStateContext();

  const handleChekout = async () => {
    const stripe = await getStripe(); // Instancia de stripe para realizar los pagos

    const response = await fetch('/api/stripe', { // Petición a nuestra API para realizar el pago de nuestro carrito
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartItems),
    })

    if(response.statusCode === 500) return; // Si la petición falla, no se realiza el pago

    const data = await response.json(); // Obtenemos los datos de la respuesta de la API

    toast.loading('Redirecting...');

    stripe.redirectToCheckout({ sessionId: data.id });  // Redirigimos a stripe para realizar el pago
  }

  return (
    // pos:fixed r:0 t:0 z-index:100
    <div className="cart-wrapper" ref={ cartRef }>
        {/* width:600px height:100vh float:right */}
      <div className="cart-container">
        
        <button
          type="button"
          className="close-heading"
          onClick={() => setShowCart( false )}>
          <AiOutlineLeft />
          <span className="heading">Your Cart</span>
          <span className="cart-num-items">({ totalQuantities })</span>
        </button>

        {cartItems.length < 1 && (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>Your shopping bag is empty</h3>
            <Link href="/">
              <button
                type="button"
                onClick={() => setShowCart(false)}
                className="btn"
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        )}

          {/* overflow: auto */}
        <div className="product-container">
          {cartItems.length >= 1 && cartItems.map((item) => (
                      //dp:flex
            <div className="product" key={item._id}>

               <img src={urlFor(item?.image[0])} className="cart-product-image" />

               {/* dp:flex jc:space-between width: 350px */}
               <div className="item-desc">
                  <div className="flex top">
                     <h5>{ item.name }</h5>
                     <h4>${ item.price }</h4>
                  </div>
                  
                  <div className="flex bottom">
                    <div>
                      <p className="quantity-desc">
                          <span className="minus" onClick={() => toggleCartItemQuantity(item._id, 'dec')}>
                            <AiOutlineMinus />
                          </span>
                          <span className="num">{item.quantity}</span>
                          <span className="plus" onClick={() => toggleCartItemQuantity(item._id, 'inc')  }>
                            <AiOutlinePlus />
                          </span>
                      </p>
                    </div>

                    <button
                      type="button"
                      className="remove-item"
                      onClick={() => onRemove(item)} 
                    >
                      <TiDeleteOutline />
                  </button>

                  </div>
               </div>
            </div>
          ))}
        </div>

        { cartItems.length >= 1 && (
          <div className="cart-bottom">
            <div className="total">
              <h3>Subtotal:</h3>
              <h3>${ totalPrice }</h3>
            </div>
            <div className="btn-container">
              <button type="button" className="btn" onClick={ handleChekout }>
                Pay with Stripe
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Cart