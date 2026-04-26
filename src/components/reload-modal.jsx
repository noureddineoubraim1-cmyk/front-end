// src/components/reload-modal.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

function ReloadModal({ onClose, onSuccess }) {
    const { currentUser, reloadMoney } = useAuth();
    const [amount, setAmount] = useState("");
    const [cardNum, setCardNum] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentUser.wallet.cards.length > 0) {
            setCardNum(currentUser.wallet.cards[0].numcards);
        }
    }, [currentUser]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        if (amount > 0 && cardNum) {
            setLoading(true);
            const result = reloadMoney(cardNum, amount);
            if (result.success) {
                alert("Recharge réussie !");
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
                    <h2>Recharger mon compte (Card -> Balance)</h2>
                    <button className="btn-close" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit} className="transfer-form">
                    <div className="form-group">
                        <label>Choisir la carte source</label>
                        <select value={cardNum} onChange={(e) => setCardNum(e.target.value)}>
                            {currentUser.wallet.cards.map((card, idx) => (
                                <option key={idx} value={card.numcards}>
                                    {card.type.toUpperCase()} - ****{card.numcards.slice(-4)} ({card.balance} MAD)
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Montant à transférer vers le balance (MAD)</label>
                        <input 
                            type="number" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            placeholder="Ex: 100"
                            required
                        />
                    </div>
                    {error && <div style={{ color: "red", marginBottom: "1rem", textAlign: "center" }}>{error}</div>}
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Chargement..." : "Recharger maintenant"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default ReloadModal;

