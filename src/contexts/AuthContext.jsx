// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { findUserByEmail, findUserById, getUsers, saveUsers } from '../services/database';
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
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // useEffect pour rafraîchir les données régulièrement (simule des notifications en temps réel)
  useEffect(() => {
    if (currentUser) {
      const interval = setInterval(() => {
        refreshUser();
      }, 5000); // Toutes les 5 secondes
      return () => clearInterval(interval);
    }
  }, [currentUser?.id]);

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
    if (!currentUser) return null;
    const updatedUser = findUserById(currentUser.id);
    if (updatedUser) {
      // Éviter de mettre à jour l'état si rien n'a changé (pour éviter les re-renders inutiles)
      if (JSON.stringify(updatedUser) !== JSON.stringify(currentUser)) {
        setCurrentUser(updatedUser);
        sessionStorage.setItem("currentUser", JSON.stringify(updatedUser));
      }
      return updatedUser;
    }
    return null;
  };

  const transferMoney = (sourceCardNum, beneficiaryCardNum, amount) => {
    const users = getUsers();
    const sender = users.find(u => u.id === currentUser.id);
    const beneficiary = users.find(u => u.wallet.cards.some(c => c.numcards === beneficiaryCardNum));

    if (!sender || !beneficiary) return { success: false, error: "Utilisateur non trouvé" };

    const sourceCard = sender.wallet.cards.find(c => c.numcards === sourceCardNum);
    const beneficiaryCard = beneficiary.wallet.cards.find(c => c.numcards === beneficiaryCardNum);

    if (sourceCard.balance < amount) return { success: false, error: "Solde insuffisant" };

    sourceCard.balance -= amount;
    sender.wallet.balance -= amount;
    beneficiaryCard.balance += amount;
    beneficiary.wallet.balance += amount;

    const date = new Date().toLocaleDateString();
    sender.wallet.transactions.unshift({ id: Date.now(), type: "debit", amount, date, to: beneficiary.name });
    beneficiary.wallet.transactions.unshift({ id: Date.now() + 1, type: "credit", amount, date, from: sender.name });

    saveUsers(users);
    refreshUser();
    return { success: true, message: "Transfert réussi !" };
  };

  const reloadMoney = (cardNum, amount) => {
    const users = getUsers();
    const user = users.find(u => u.id === currentUser.id);
    const card = user.wallet.cards.find(c => c.numcards === cardNum);

    const val = parseFloat(amount);
    if (card.balance < val) return { success: false, error: "Solde de la carte insuffisant" };

    // Transfert de la CARTE vers le BALANCE du wallet
    card.balance -= val;
    user.wallet.balance += val;

    user.wallet.transactions.unshift({
      id: Date.now(),
      type: "credit",
      amount: val,
      date: new Date().toLocaleDateString(),
      from: `Carte ****${cardNum.slice(-4)}`,
      to: "Wallet Balance"
    });

    saveUsers(users);
    refreshUser();
    return { success: true };
  };

  const requestMoney = (targetEmail, amount, targetCardNum) => {
    const users = getUsers();
    const targetUser = users.find(u => u.email === targetEmail);
    
    if (!targetUser) return { success: false, error: "Utilisateur introuvable" };
    if (targetUser.id === currentUser.id) return { success: false, error: "Vous ne pouvez pas vous demander à vous-même" };

    if (!targetUser.requests) targetUser.requests = [];

    targetUser.requests.unshift({
      id: Date.now(),
      fromId: currentUser.id,
      fromName: currentUser.name,
      amount: parseFloat(amount),
      targetCardNum: targetCardNum,
      status: "pending",
      date: new Date().toLocaleDateString()
    });

    saveUsers(users);
    return { success: true, message: "Demande envoyée !" };
  };

  const handleRequest = (requestId, action) => {
    const users = getUsers();
    const user = users.find(u => u.id === currentUser.id);
    const request = user.requests.find(r => r.id === requestId);

    if (!request || request.status !== "pending") return { success: false };

    if (action === "accept") {
      const requester = users.find(u => u.id === request.fromId);
      
      // Trouver la carte spécifique qui a été sollicitée
      const targetCard = user.wallet.cards.find(c => c.numcards === request.targetCardNum);
      
      if (!targetCard || targetCard.balance < request.amount) {
          return { success: false, error: "Solde insuffisant sur la carte sollicitée" };
      }

      targetCard.balance -= request.amount;
      user.wallet.balance -= request.amount;
      
      requester.wallet.balance += request.amount;

      const date = new Date().toLocaleDateString();
      user.wallet.transactions.unshift({ id: Date.now(), type: "debit", amount: request.amount, date, to: requester.name });
      requester.wallet.transactions.unshift({ id: Date.now() + 1, type: "credit", amount: request.amount, date, from: user.name });

      request.status = "accepted";
    } else {
      request.status = "refused";
    }

    saveUsers(users);
    refreshUser();
    return { success: true };
  };


  const value = {
    currentUser,
    login,
    logout,
    refreshUser,
    transferMoney,
    reloadMoney,
    requestMoney,
    handleRequest,
    isAuthenticated: !!currentUser,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
