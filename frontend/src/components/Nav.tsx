import { NavLink } from 'react-router-dom'

const Nav = () => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
    <NavLink to="/sleep" className="flex-1 text-center" end>Sleep</NavLink>
    <NavLink to="/feeding" className="flex-1 text-center" end>Feeding</NavLink>
    <NavLink to="/diaper" className="flex-1 text-center" end>Diapers</NavLink>
    <NavLink to="/summary" className="flex-1 text-center" end>Summary</NavLink>
  </nav>
)

export default Nav
