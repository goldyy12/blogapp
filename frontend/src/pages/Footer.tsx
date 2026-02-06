import "../styles/footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">

                <div className="footer-brand">
                    <h2>BlogApp</h2>
                    <p>
                        A modern platform for sharing ideas, knowledge, and
                        stories with a global audience.
                    </p>
                    <div className="footer-socials">
                        <a href="#">𝕏</a>
                        <a href="#">📸</a>
                    </div>
                </div>


                <div className="footer-links">
                    <h4>Quick Links</h4>
                    <a href="/">Home</a>
                    <a href="/about">About</a>
                    <a href="/login">Login</a>
                    <a href="/register">Sign Up</a>
                </div>


                <div className="footer-links">
                    <h4>Legal</h4>
                    <a href="/terms">Terms of Service</a>
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/cookies">Cookie Policy</a>
                </div>
            </div>

            <div className="footer-bottom">
                © 2025 BlogApp. All rights reserved.
            </div>
        </footer>
    );
}
