// src/components/hero.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Hero() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!email || !password) {
            setError("Veuillez remplir tous les champs");
            return;
        }
        
        const success = login(email, password);
        if (success) {
            navigate("/dashboard");
        } else {
            setError("Email ou mot de passe incorrect");
        }
    }
    
    return (
        <main>
            <section className="hero">
                <div className="hero-content">
                    <h1>Connexion</h1>
                    <p>Accédez à votre E-Wallet en toute sécurité.</p>
                    {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
                    <form className="login-form" onSubmit={(e) => e.preventDefault()}>
                        <div className="input-group">
                            <input 
                                type="email" 
                                placeholder="Adresse e-mail" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>
                        <div className="input-group">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="Mot de passe" 
                            />
                            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>👁</span>
                        </div>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                            Se connecter
                        </button>
                    </form>
                    <p style={{ marginTop: "15px", fontSize: "0.9rem" }}>
                        Vous n'avez pas encore de compte ?
                        <a href="#" style={{ color: "#3b66f6", fontWeight: "600" }}> S'inscrire</a>
                    </p>
                </div>
                <div className="hero-image">
                    <img src="/src/assets/e-Wallet6.gif" alt="Illustration de connexion" />
                </div>
            </section>
        </main>
    );
}

export default Hero;