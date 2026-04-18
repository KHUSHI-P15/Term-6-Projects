import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Portal Overview" },
  { to: "/fake-login", label: "Student Verification" },
  { to: "/result", label: "Simulation Outcome" },
  { to: "/security-tips", label: "Detection Guide" },
  { to: "/admin-login", label: "Admin Login" }
];

function Navbar() {
  return (
    <header className="site-header">
      <div className="site-brand">
        <span className="brand-badge">VTI</span>
        <div>
          <p className="brand-title">VTI Institute Portal</p>
          <p className="brand-subtitle">Academic Verification Center</p>
        </div>
      </div>

      <nav className="site-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive ? "nav-link nav-link-active" : "nav-link"
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;
