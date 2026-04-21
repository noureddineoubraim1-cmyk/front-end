// src/components/transfer-modal.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getUsers } from "../services/database";

function TransferModal({ onClose, onSuccess }) {
    const { currentUser, transferMoney } = useAuth();
    const [amount, setAmount] = useState("");
    const [sourceCardNum, setSourceCardNum] = useState("");
    const [beneficiaryCardNum, setBeneficiaryCardNum] = useState("");
    const [isInstant, setIsInstant] = useState(false);
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Charger les bénéficiaires (autres utilisateurs)
        const users = getUsers();
        const otherUsers = users.filter(u => u.id !== currentUser.id);
        const beneficiaryList = [];
        otherUsers.forEach(user => {
            user.wallet.cards.forEach(card => {
                beneficiaryList.push({
                    cardNum: card.numcards,
                    userName: user.name,
                    cardType: card.type,
                });
            });
        });
        setBeneficiaries(beneficiaryList);
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!amount || parseFloat(amount) <= 0) {
            setError("Montant invalide");
            return;
        }
        if (!sourceCardNum) {
            setError("Sélectionnez une carte source");
            return;
        }
        if (!beneficiaryCardNum) {
            setError("Sélectionnez un bénéficiaire");
            return;
        }

        setLoading(true);
        const result = transferMoney(sourceCardNum, beneficiaryCardNum, parseFloat(amount), isInstant);
        
        if (result.success) {
            alert(result.message);
            onSuccess();
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const fee = isInstant ? 13.4 : 0;
    const totalAmount = amount ? parseFloat(amount) + fee : 0;

    return (
        <>
            <div className="modal-overlay" onClick={onClose}></div>
            <div className="transfer-section" style={{ display: "block" }}>
                <div className="section-header">
                    <h2>Effectuer un transfert</h2>
                    <button className="btn-close" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="transfer-form">
                    <div className="form-group">
                        <label>Bénéficiaire</label>
                        <select 
                            value={beneficiaryCardNum} 
                            onChange={(e) => setBeneficiaryCardNum(e.target.value)}
                            required
                        >
                            <option value="">Choisir un bénéficiaire</option>
                            {beneficiaries.map((ben, idx) => (
                                <option key={idx} value={ben.cardNum}>
                                    {ben.userName} - {ben.cardType.toUpperCase()} ****{ben.cardNum.slice(-4)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Depuis ma carte</label>
                        <select 
                            value={sourceCardNum} 
                            onChange={(e) => setSourceCardNum(e.target.value)}
                            required
                        >
                            <option value="">Sélectionner une carte</option>
                            {currentUser.wallet.cards.map((card, idx) => (
                                <option key={idx} value={card.numcards}>
                                    {card.type.toUpperCase()} - ****{card.numcards.slice(-4)} ({parseFloat(card.balance).toFixed(2)} MAD)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Montant (MAD)</label>
                        <input 
                            type="number" 
                            min="1" 
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <div className="form-options">
                        <div className="checkbox-group">
                            <input 
                                type="checkbox" 
                                id="instantTransfer"
                                checked={isInstant}
                                onChange={(e) => setIsInstant(e.target.checked)}
                            />
                            <label htmlFor="instantTransfer">
                                Transfert instantané <span className="fee-badge">+13.4 MAD</span>
                            </label>
                        </div>
                    </div>

                    {amount && (
                        <div className="transfer-summary">
                            <h4>Récapitulatif</h4>
                            <div className="summary-row">
                                <span>Montant</span>
                                <span>{parseFloat(amount).toFixed(2)} MAD</span>
                            </div>
                            {isInstant && (
                                <div className="summary-row">
                                    <span>Frais (instantané)</span>
                                    <span>13.40 MAD</span>
                                </div>
                            )}
                            <div className="summary-row total">
                                <span>Total à débiter</span>
                                <span>{totalAmount.toFixed(2)} MAD</span>
                            </div>
                        </div>
                    )}

                    {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Annuler
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Traitement..." : "Transférer"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default TransferModal;