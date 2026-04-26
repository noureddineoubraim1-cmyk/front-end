// src/components/header.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";

function Header({ siteTitle, isDashboard = false }) {
    const { currentUser, logout } = useAuth();
    const [greeting, setGreeting] = useState("Bonjour");

    // useEffect pour adapter le message de bienvenue
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 18) {
            setGreeting("Bonsoir");
        } else {
            setGreeting("Bonjour");
        }
    }, []);

    return (
        <header>
            <nav className="navbar">
                <Link to="/" className="logo">
                    <img src="/src/assets/e-wallet-logo.avif" alt="Logo E-Wallet" />
                </Link>
                <ul className="nav-links">
                    <li><Link to="/">Accueil</Link></li>
                    {isDashboard && currentUser ? (
                        <>
                            <li style={{ color: "white", fontWeight: "bold" }}>{greeting}, {currentUser.name}</li>
                            <li>
                                <button className="btn btn-logout" onClick={logout} style={{ background: "none", border: "none", cursor: "pointer", color: "white" }}>
                                    <i className="fas fa-sign-out-alt"></i> Déconnexion
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li><a href="#">À propos</a></li>
                            <li><a href="#">Fonctionnalités</a></li>
                            <li><a href="#">Contact</a></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Header;