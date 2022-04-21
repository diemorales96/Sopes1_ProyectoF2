import React from 'react'
import logo from '../logo.svg';
import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
    NavBtn,
    NavBtnLink
  } from './NavBarElements';

const Navbar = () => {
  return (
    <>
    <Nav>
        <NavLink to="/">
        <img src={logo} alt="Logo" />
        </NavLink>
        <Bars />
        <NavMenu>
            <NavLink to='/Mongo' >
               <h3>MongoDB</h3>
            </NavLink>
            <NavLink to='/Tidb' >
                <h3>Redis</h3>
            </NavLink>
            <NavLink to='/Redis' >
                <h3>TiDB</h3>
            </NavLink>
        </NavMenu>
        <NavBtn>
            <NavBtnLink to='hola'>About</NavBtnLink>
        </NavBtn>

    </Nav>
    
    </>
  )
}

export default Navbar