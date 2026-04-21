// src/components/sidebar.jsx
import { useAuth } from "../contexts/AuthContext";

function Sidebar({ activeSection, setActiveSection }) {
    const { logout } = useAuth();

    const menuItems = [
        { id: "overview", icon: "fas fa-home", label: "Vue d'ensemble" },
        { id: "transactions", icon: "fas fa-exchange-alt", label: "Transactions" },
        { id: "cards", icon: "fas fa-credit-card", label: "Mes cartes" },
        { id: "transfers", icon: "fas fa-paper-plane", label: "Transferts" },
    ];

    return (
        <aside className="dashboard-sidebar">
            <nav className="sidebar-nav">
                <ul>
                    {menuItems.map(item => (
                        <li key={item.id} className={activeSection === item.id ? "active" : ""}>
                            <a href="#" onClick={(e) => { e.preventDefault(); setActiveSection(item.id); }}>
                                <i className={item.icon}></i>
                                <span>{item.label}</span>
                            </a>
                        </li>
                    ))}
                    <li className="separator"></li>
                    <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); logout(); }} style={{ color: "#e74c3c" }}>
                            <i className="fas fa-sign-out-alt"></i>
                            <span>Déconnexion</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;