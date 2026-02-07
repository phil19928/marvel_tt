import { NavLink } from "react-router-dom";
import "./Header.css";

const Header = () => {
    return (
        <header className="header">
            <NavLink to="/characters" className="logo">
                MARVEL
            </NavLink>
            <nav className="nav">
                <NavLink
                    to="/characters"
                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                    Personnages
                </NavLink>
                <NavLink
                    to="/comics"
                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                    Comics
                </NavLink>
                <NavLink
                    to="/favorites"
                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                    ★ Favoris
                </NavLink>
            </nav>
        </header>
    );
};

export default Header;
