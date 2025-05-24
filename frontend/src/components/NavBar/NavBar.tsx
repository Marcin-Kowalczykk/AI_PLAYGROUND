import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from './constants'
import './NavBar.css'

const NavBar = () => {
  return (
    <nav className="navbar">
      {NAV_ITEMS.map(({ path, label }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) => (isActive ? 'navbar-link active' : 'navbar-link')}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export default NavBar
