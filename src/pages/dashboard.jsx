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
import ReloadModal from "../components/reload-modal";
import RequestModal from "../components/request-modal";

function Dashboard() {
    const { currentUser, isAuthenticated, loading, handleRequest } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState("overview");
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [showReloadModal, setShowReloadModal] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/login");
        }
    }, [loading, isAuthenticated, navigate]);

    // useEffect pour surveiller les nouvelles requêtes (pédagogique)
    useEffect(() => {
        const pendingRequests = currentUser?.requests?.filter(r => r.status === "pending") || [];
        if (pendingRequests.length > 0) {
            console.log(`Vous avez ${pendingRequests.length} demande(s) en attente`);
        }
    }, [currentUser?.requests]);

    if (loading || !currentUser) {
        return <div style={{ textAlign: "center", padding: "50px" }}>Chargement...</div>;
    }

    const wallet = currentUser.wallet;
    const pendingRequests = currentUser.requests?.filter(r => r.status === "pending") || [];
    
    const totalIncome = wallet.transactions
        .filter(t => t.type === "credit")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const totalExpenses = wallet.transactions
        .filter(t => t.type === "debit")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const onHandleAction = (id, action) => {
        const result = handleRequest(id, action);
        if (!result.success && result.error) {
            alert(result.error);
        }
    };

    return (
        <>
            <Header siteTitle="E-Wallet" isDashboard={true} />
            <main className="dashboard-main">
                <div className="dashboard-container">
                    <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
                    <div className="dashboard-content">
                        <div className="section-header">
                            <h2>Bonjour, {currentUser.name} !</h2>
                            <p className="date-display">{new Date().toLocaleDateString()}</p>
                        </div>

                        {/* Notification de demande d'argent */}
                        {pendingRequests.length > 0 && (
                            <div className="notifications-panel" style={{ background: "#fff5f5", borderLeft: "5px solid #ff4d4d", padding: "15px", marginBottom: "20px", borderRadius: "8px" }}>
                                <h3 style={{ color: "#d32f2f", marginBottom: "10px" }}><i className="fas fa-bell"></i> Demandes d'argent en attente</h3>
                                {pendingRequests.map(req => (
                                    <div key={req.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", borderBottom: "1px solid #eee" }}>
                                        <span><strong>{req.fromName}</strong> vous demande <strong>{req.amount} MAD</strong> depuis votre carte ****{req.targetCardNum?.slice(-4)}</span>
                                        <div>
                                            <button className="btn btn-primary" onClick={() => onHandleAction(req.id, "accept")} style={{ padding: "5px 10px", marginRight: "5px" }}>Accepter</button>
                                            <button className="btn btn-secondary" onClick={() => onHandleAction(req.id, "refuse")} style={{ padding: "5px 10px" }}>Refuser</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeSection === "overview" && (
                            <>
                                <SummaryCards 
                                    balance={wallet.balance}
                                    currency={wallet.currency}
                                    totalIncome={totalIncome}
                                    totalExpenses={totalExpenses}
                                    cardsCount={wallet.cards.length}
                                />
                                <QuickActions 
                                    onTransfer={() => setShowTransferModal(true)} 
                                    onReload={() => setShowReloadModal(true)}
                                    onRequest={() => setShowRequestModal(true)}
                                />
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
                                            <div className="card-holder">{currentUser.name.toUpperCase()}</div>
                                            <div className="card-expiry">{card.expiry}</div>
                                            <div className="card-type">{card.type.toUpperCase()}</div>
                                        </div>
                                        <div style={{ marginTop: "1rem", textAlign: "center" }}>
                                            <strong>Solde: {card.balance} {wallet.currency}</strong>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer annee={2026} nomSite="E-Wallet" />

            {showTransferModal && <TransferModal onClose={() => setShowTransferModal(false)} onSuccess={() => setShowTransferModal(false)} />}
            {showReloadModal && <ReloadModal onClose={() => setShowReloadModal(false)} onSuccess={() => setShowReloadModal(false)} />}
            {showRequestModal && <RequestModal onClose={() => setShowRequestModal(false)} onSuccess={() => setShowRequestModal(false)} />}
        </>
    );
}

export default Dashboard;



