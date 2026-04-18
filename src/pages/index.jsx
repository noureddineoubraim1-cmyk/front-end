import Header from "../components/header";
import Footer from "../components/footer";
import Hindex from "../components/hero-index";
function Index() {

    return (
        <>
            <Header siteTitle="E-Wallet"/>
            <Hindex titre="E-wallet" description="Gérez vos finances facilement et en toute sécurité."/>
            <Footer annee={2026} nomSite="E-Wallet"/>
        </>
    );
}

export default Index;