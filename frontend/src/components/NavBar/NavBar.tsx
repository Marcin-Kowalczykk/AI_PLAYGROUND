import React from 'react'
import { Link } from 'react-router-dom'
import './NavBar.css'

const NavBar = () => {
  return (
    <nav className="navbar">
      <Link to="/example1" className="navbar__link">
        Example 1
      </Link>
      <Link to="/example2" className="navbar__link">
        Example 2
      </Link>
      <Link to="/example3" className="navbar__link">
        Example 3
      </Link>
      <Link to="/example4" className="navbar__link">
        Example 4
      </Link>
      <Link to="/example5" className="navbar__link">
        Example 5
      </Link>
    </nav>
  )
}

export default NavBar
