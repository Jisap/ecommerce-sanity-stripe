import React from 'react';
import Link from 'next/link';
import { AiOutlineShopping } from 'react-icons/ai';
import { Cart } from './';
import { useStateContext } from '../context/StateContext';

const NavBar = () => {

  const { showCart, setShowCart, totalQuantities } = useStateContext();



  return (
    // dp:flex jc:space-between pos:relative
    <div className="navbar-container">
      <p className="logo">
        <Link href="/">JSM Headphones</Link>
      </p>
      {/* pos:relative transition*/}
      <button type="button" className="cart-icon" onClick={() => setShowCart( true )}>
        <AiOutlineShopping />
        {/* pos:absolute */}
        <span className="cart-item-qty">{ totalQuantities }</span>
      </button>

      { showCart && <Cart /> }
    </div>
  )
}

export default NavBar