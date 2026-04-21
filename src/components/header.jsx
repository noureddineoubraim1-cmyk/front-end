// src/components/header.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Header({ siteTitle, isDashboard = false }) {
    const { currentUser, logout } = useAuth();

    return (
        <header>
            <nav className="navbar">
                <Link to="/" className="logo">
                    <img src="/src/assets/e-wallet-logo.avif" alt="Logo E-Wallet" />
                </Link>
                <ul className="nav-links">
                    <li><Link to="/">Accueil</Link></li>
                    <li><a href="#">À propos</a></li>
                    <li><a href="#">Fonctionnalités</a></li>
                    <li><a href="#">Contact</a></li>
                    {isDashboard && currentUser && (
                        <li>
                            <button className="btn btn-logout" onClick={logout} style={{ background: "none", border: "none", cursor: "pointer" }}>
                                <i className="fas fa-sign-out-alt"></i> Déconnexion
                            </button>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Header;