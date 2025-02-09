import Footer from "./_components/Footer/Footer";
import Navbar from "./_components/Navbar/Navbar";

const LandingLayout = ({children}: {
    children: React.ReactNode
}) => {
    return (  
        <div className="h-full dark:bg-dark">
                <Navbar />
            <main className="h-full">
                {children}
            </main>
                <Footer />
        </div>
    );
}
 
export default LandingLayout;