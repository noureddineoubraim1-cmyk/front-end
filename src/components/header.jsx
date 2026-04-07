function Header() {
    return (
        <header>
    <nav className="navbar">
      <a href="/index.html" className="logo">
        <img src="../src/assets/e-wallet-logo.avif" alt="Logo E-Wallet"/>
      </a>
      <ul className="nav-links">
        <li><a href="/src/view/index.html">Accueil</a></li>
        <li><a href="#">À propos</a></li>
        <li><a href="#">Fonctionnalités</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
  </header>
    )
}

export default Header