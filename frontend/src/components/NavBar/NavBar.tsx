import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from './constants'
import './NavBar.css'

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="navbar">
      <button
        className="navbar-toggle"
        onClick={() => setIsOpen((event) => !event)}
        aria-label={isOpen ? 'collapse menu' : 'expand menu'}
      >
        ☰
      </button>
      <div className={`navbar-links${isOpen ? ' open' : ''}`}>
        {NAV_ITEMS.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => (isActive ? 'navbar-link active' : 'navbar-link')}
            onClick={() => setIsOpen(false)}
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default NavBar
