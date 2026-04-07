
import { useNavigate } from "react-router-dom";

function Hindex(){
    const navigate = useNavigate();
    return(
        <main>
                <section className="hero">
                    <div className="hero-content">
                        <h1>E-Wallet</h1>
                        <p>Gérez vos finances facilement et en toute sécurité.</p>
                        <div className="buttons">
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </button>
                            <button className="btn btn-secondary">
                                Sign in
                            </button>
                        </div>
                    </div>
                    <div className="hero-image">
                        <img src="../src/assets/e-Wallet6.gif" alt="E-Wallet" />
                    </div>
                </section>
        </main>
    )
}

export default Hindex;