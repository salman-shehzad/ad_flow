import { NavLink } from 'react-router-dom';

const Sidebar = ({ items }) => {
  return (
    <aside className="sidebar">
      <h4>Dashboard</h4>
      <ul>
        {items.map(item => (
          <li key={item.path}>
            <NavLink to={item.path} className={({ isActive }) => (isActive ? 'active' : '')}>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
