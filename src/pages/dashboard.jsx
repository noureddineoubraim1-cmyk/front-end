// src/pages/dashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import Sidebar from "../components/sidebar";
import SummaryCards from "../components/summary-cards";
import QuickActions from "../components/quick-actions";
import RecentTransactions from "../components/recent-transactions";
import TransferModal from "../components/transfer-modal";

function Dashboard() {
    const { currentUser, isAuthenticated, loading, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState("overview");
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [userData, setUserData] = useState(currentUser);

    useEffect(() => {
        
        if (!loading && !isAuthenticated) {
            navigate("/login");
        }
    }, [loading, isAuthenticated, navigate]);

    useEffect(() => {
        if (currentUser) {
            setUserData(refreshUser() || currentUser);
        }
    }, [currentUser, refreshUser]);

    if (loading) {
        return <div style={{ textAlign: "center", padding: "50px" }}>Chargement...</div>;
    }

    if (!userData) {
        return null;
    }

    const wallet = userData.wallet;
    const totalIncome = wallet.transactions
        .filter(t => t.type === "credit")
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = wallet.transactions
        .filter(t => t.type === "debit")
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <>
            <Header siteTitle="E-Wallet" isDashboard={true} />
            <main className="dashboard-main">
                <div className="dashboard-container">
                    <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
                    <div className="dashboard-content">
                        <div className="section-header">
                            <h2>Bonjour, {userData.name} !</h2>
                            <p className="date-display">
                                {new Date().toLocaleDateString("fr-FR", { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </p>
                        </div>

                        {activeSection === "overview" && (
                            <>
                                <SummaryCards 
                                    balance={wallet.balance}
                                    currency={wallet.currency}
                                    totalIncome={totalIncome}
                                    totalExpenses={totalExpenses}
                                    cardsCount={wallet.cards.length}
                                />
                                <QuickActions onTransfer={() => setShowTransferModal(true)} />
                                <RecentTransactions transactions={wallet.transactions} currency={wallet.currency} />
                            </>
                        )}

                        {activeSection === "cards" && (
                            <div className="cards-grid">
                                {wallet.cards.map((card, index) => (
                                    <div key={index} className="card-item">
                                        <div className={`card-preview ${card.type}`}>
                                            <div className="card-chip"></div>
                                            <div className="card-number">**** {card.numcards.slice(-4)}</div>
                                            <div className="card-holder">{userData.name.toUpperCase()}</div>
                                            <div className="card-expiry">{card.expiry}</div>
                                            <div className="card-type">{card.type.toUpperCase()}</div>
                                        </div>
                                        <div className="card-actions">
                                            <button className="card-action" title="Solde">
                                                <i className="fas fa-chart-line"></i>
                                            </button>
                                            <button className="card-action" title="Geler">
                                                <i className="fas fa-snowflake"></i>
                                            </button>
                                        </div>
                                        <div style={{ marginTop: "1rem", textAlign: "center" }}>
                                            <strong>Solde: {parseFloat(card.balance).toFixed(2)} {wallet.currency}</strong>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeSection === "transfers" && (
                            <div style={{ textAlign: "center", padding: "50px" }}>
                                <button 
                                    className="btn btn-primary" 
                                    onClick={() => setShowTransferModal(true)}
                                    style={{ padding: "15px 30px", fontSize: "1.1rem" }}
                                >
                                    <i className="fas fa-paper-plane"></i> Effectuer un transfert
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer annee={2026} nomSite="E-Wallet" />

            {showTransferModal && (
                <TransferModal 
                    onClose={() => setShowTransferModal(false)} 
                    onSuccess={() => {
                        setUserData(refreshUser() || currentUser);
                        setShowTransferModal(false);
                    }}
                />
            )}
        </>
    );
}

export default Dashboard;