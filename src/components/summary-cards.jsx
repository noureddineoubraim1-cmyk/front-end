// src/components/summary-cards.jsx
function SummaryCards({ balance, currency, totalIncome, totalExpenses, cardsCount }) {
    const cards = [
        { icon: "fas fa-wallet", color: "blue", label: "Solde disponible", value: `${parseFloat(balance).toFixed(2)} ${currency}` },
        { icon: "fas fa-arrow-up", color: "green", label: "Revenus", value: `+${totalIncome.toFixed(2)} ${currency}` },
        { icon: "fas fa-arrow-down", color: "red", label: "Dépenses", value: `-${totalExpenses.toFixed(2)} ${currency}` },
        { icon: "fas fa-credit-card", color: "purple", label: "Cartes actives", value: cardsCount },
    ];

    return (
        <div className="summary-cards">
            {cards.map((card, index) => (
                <div key={index} className="summary-card">
                    <div className={`card-icon ${card.color}`}>
                        <i className={card.icon}></i>
                    </div>
                    <div className="card-details">
                        <span className="card-label">{card.label}</span>
                        <span className="card-value">{card.value}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default SummaryCards;