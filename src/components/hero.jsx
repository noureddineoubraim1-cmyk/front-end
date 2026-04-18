import { useState } from "react";

function Hero() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = () => {
        if(!email || !password){
            console.log("veuillez remplir tous les champs");
            return;
        }
        console.log("Email:", email);
        console.log("password:", password);
    }
    
    return (
        <main>
            <section className="hero">
                <div className="hero-content">
                    <h1>Connexion</h1>
                    <p>Accédez à votre E-Wallet en toute sécurité.</p>
                    <form className="login-form">
                        <div className="input-group">
                            <input type="email" placeholder="Adresse e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" />
                            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>👁</span>
                        </div>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                            Se connecter
                        </button>
                    </form>
                    
                </div>
                <div className="hero-image">
                    <img src="/src/assets/e-Wallet6.gif" alt="Illustration de connexion" />
                </div>
            </section>
        </main>
    );
}

export default Hero;