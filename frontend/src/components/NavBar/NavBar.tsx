import { Link } from 'react-router-dom'
import { NAV_ITEMS } from './constants'
import './NavBar.css'

const NavBar = () => {
  return (
    <nav className="navbar">
      {NAV_ITEMS.map(({ path, label }) => (
        <Link key={path} to={path} className="navbar__link">
          {label}
        </Link>
      ))}
    </nav>
  )
}

export default NavBar
