import { Link, useLocation } from "react-router-dom";
import "./Header.css";

function Header() {
    const location = useLocation();
    const currentPath = location.pathname;

    function getLinkClass(path) {
        if (currentPath === path) {
            return "nav-link active";
        } else {
            return "nav-link";
        }
    }

    return (
        <header className="header">
            <Link to="/" className="logo">MARVEL</Link>
            <nav className="nav">
                <Link to="/characters" className={getLinkClass("/characters")}>
                    Personnages
                </Link>
                <Link to="/comics" className={getLinkClass("/comics")}>
                    Comics
                </Link>
                <Link to="/favorites" className={getLinkClass("/favorites")}>
                    Favoris
                </Link>
            </nav>
        </header>
    );
}

export default Header;
