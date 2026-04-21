// src/components/recent-transactions.jsx
function RecentTransactions({ transactions, currency }) {
    const recentTransactions = transactions.slice(0, 5);

    if (recentTransactions.length === 0) {
        return (
            <div className="recent-transactions">
                <h3>Transactions récentes</h3>
                <p style={{ color: "gray", textAlign: "center", padding: "20px" }}>Aucune transaction</p>
            </div>
        );
    }

    return (
        <div className="recent-transactions">
            <h3>Transactions récentes</h3>
            <div className="transactions-list">
                {recentTransactions.map((transaction, index) => {
                    const isCredit = transaction.type === "credit";
                    const amount = isCredit ? `+${transaction.amount.toFixed(2)}` : `-${transaction.amount.toFixed(2)}`;
                    
                    return (
                        <div key={transaction.id || index} className="transaction-item">
                            <div className={`transaction-icon ${isCredit ? "credit" : "debit"}`}>
                                <i className={`fas ${isCredit ? "fa-arrow-down" : "fa-arrow-up"}`}></i>
                            </div>
                            <div className="transaction-details">
                                <span className="transaction-name">
                                    {isCredit ? `De: ${transaction.from}` : `Vers: ${transaction.to}`}
                                </span>
                                <span className="transaction-date">{transaction.date}</span>
                            </div>
                            <div className={`transaction-amount ${isCredit ? "credit" : "debit"}`}>
                                {amount} {currency}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default RecentTransactions;