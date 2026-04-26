// src/components/request-modal.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getUsers } from "../services/database";

function RequestModal({ onClose, onSuccess }) {
    const { currentUser, requestMoney } = useAuth();
    const [amount, setAmount] = useState("");
    const [targetCardNum, setTargetCardNum] = useState("");
    const [allCards, setAllCards] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // useEffect pour charger toutes les cartes des autres utilisateurs
    useEffect(() => {
        const users = getUsers();
        const otherUsers = users.filter(u => u.id !== currentUser.id);
        const cardsList = [];
        
        otherUsers.forEach(user => {
            user.wallet.cards.forEach(card => {
                cardsList.push({
                    cardNum: card.numcards,
                    ownerName: user.name,
                    ownerEmail: user.email,
                    type: card.type
                });
            });
        });
        
        setAllCards(cardsList);
        if (cardsList.length > 0) {
            setTargetCardNum(cardsList[0].cardNum);
        }
    }, [currentUser.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        // Trouver l'email du propriétaire de la carte choisie
        const cardInfo = allCards.find(c => c.cardNum === targetCardNum);
        
        if (amount > 0 && cardInfo) {
            setLoading(true);
            const result = requestMoney(cardInfo.ownerEmail, amount, targetCardNum);
            if (result.success) {
                alert(result.message);
                onSuccess();
            } else {
                setError(result.error);
            }
            setLoading(false);
        }
    };

    return (
        <>
            <div className="modal-overlay" onClick={onClose}></div>
            <div className="transfer-section" style={{ display: "block" }}>
                <div className="section-header">
                    <h2>Demander de l'argent</h2>
                    <button className="btn-close" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit} className="transfer-form">
                    <div className="form-group">
                        <label>Choisir la carte à solliciter</label>
                        <select 
                            value={targetCardNum} 
                            onChange={(e) => setTargetCardNum(e.target.value)}
                            required
                        >
                            {allCards.map((card, idx) => (
                                <option key={idx} value={card.cardNum}>
                                    {card.ownerName} - {card.type.toUpperCase()} (****{card.cardNum.slice(-4)})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Montant à demander (MAD)</label>
                        <input 
                            type="number" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            placeholder="Ex: 50"
                            required
                        />
                    </div>
                    {error && <div style={{ color: "red", marginBottom: "1rem", textAlign: "center" }}>{error}</div>}
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
                        <button type="submit" className="btn btn-primary" disabled={loading || allCards.length === 0}>
                            {loading ? "Envoi..." : "Envoyer la demande"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default RequestModal;


