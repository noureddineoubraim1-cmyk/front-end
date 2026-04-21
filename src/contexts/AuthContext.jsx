// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { findUserByEmail, updateUser, getUsers, findUserById, saveUsers } from '../services/database';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("currentUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const user = findUserByEmail(email, password);
    if (user) {
      setCurrentUser(user);
      sessionStorage.setItem("currentUser", JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem("currentUser");
    navigate("/");
  };

  const refreshUser = () => {
    if (currentUser) {
      const updatedUser = findUserById(currentUser.id);
      if (updatedUser) {
        setCurrentUser(updatedUser);
        sessionStorage.setItem("currentUser", JSON.stringify(updatedUser));
        return updatedUser;
      }
    }
    return null;
  };

  const transferMoney = (sourceCardNum, beneficiaryCardNum, amount, isInstant = false) => {
    const users = getUsers();
    const sender = users.find(u => u.id === currentUser.id);
    const beneficiary = users.find(u => 
      u.wallet.cards.some(c => c.numcards === beneficiaryCardNum)
    );

    if (!sender || !beneficiary) return { success: false, error: "Utilisateur non trouvé" };

    const sourceCard = sender.wallet.cards.find(c => c.numcards === sourceCardNum);
    const beneficiaryCard = beneficiary.wallet.cards.find(c => c.numcards === beneficiaryCardNum);

    if (!sourceCard) return { success: false, error: "Carte source introuvable" };

    const fee = isInstant ? 13.4 : 0;
    const totalAmount = amount + fee;

    if (parseFloat(sourceCard.balance) < totalAmount) {
      return { success: false, error: "Solde insuffisant" };
    }

    const today = new Date().toLocaleDateString("fr-FR");
    const transferId = Date.now().toString();

    sourceCard.balance = parseFloat(sourceCard.balance) - totalAmount;
    sender.wallet.balance = parseFloat(sender.wallet.balance) - totalAmount;
    sender.wallet.transactions.unshift({
      id: transferId,
      type: "debit",
      amount: totalAmount,
      date: today,
      from: sourceCardNum,
      to: beneficiary.name,
    });

    beneficiaryCard.balance = parseFloat(beneficiaryCard.balance) + amount;
    beneficiary.wallet.balance = parseFloat(beneficiary.wallet.balance) + amount;
    beneficiary.wallet.transactions.unshift({
      id: transferId + "b",
      type: "credit",
      amount: amount,
      date: today,
      from: sender.name,
      to: beneficiaryCardNum,
    });

    saveUsers(users);
    refreshUser();

    return { success: true, message: `Transfert de ${amount} MAD à ${beneficiary.name} effectué` };
  };

  const value = {
    currentUser,
    login,
    logout,
    refreshUser,
    transferMoney,
    isAuthenticated: !!currentUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};