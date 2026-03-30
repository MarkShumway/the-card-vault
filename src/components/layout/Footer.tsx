const YEAR = new Date().getFullYear()
const VERSION = '1.0.0'

function Footer() {
    return (
        <footer className="footer">
            <div className="footer__brand">
                <img
                    className="footer__logo"
                    src="/favicon.svg"
                    alt="The Card Vault"
                />
                <span className="footer__name">The Card Vault</span>
            </div>

            <div className="footer__meta">
                <span className="footer__copyright">© {YEAR} The Card Vault</span>
                <span className="footer__divider">·</span>
                <span className="footer__version">v{VERSION}</span>
                <span className="footer__divider">·</span>
                <span className="footer__copyright">Built with React & Supabase</span>
            </div>

            <div className="footer__links">
                <a
                    className="footer__link"
                    href="https://github.com/MarkShumway/the-card-vault"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub
                </a>
                <a
                    className="footer__link"
                    href="https://the-card-vault.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Live Site
                </a>
            </div>
        </footer>
    )
}

export default Footer
