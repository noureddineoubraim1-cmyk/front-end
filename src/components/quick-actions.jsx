// src/components/quick-actions.jsx
function QuickActions({ onTransfer }) {
    return (
        <div className="quick-actions">
            <h3>Actions rapides</h3>
            <div className="action-buttons">
                <button className="action-btn" onClick={onTransfer}>
                    <i className="fas fa-paper-plane"></i>
                    <span>Transférer</span>
                </button>
                <button className="action-btn">
                    <i className="fas fa-plus-circle"></i>
                    <span>Recharger</span>
                </button>
                <button className="action-btn">
                    <i className="fas fa-hand-holding-usd"></i>
                    <span>Demander</span>
                </button>
            </div>
        </div>
    );
}

export default QuickActions;