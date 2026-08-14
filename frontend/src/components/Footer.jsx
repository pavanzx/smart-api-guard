function Footer() {
  return (
    <footer className="premium-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <div className="footer-logo">
            <span>𓃦</span>
          </div>

          <div>
            <strong>SMART API GUARD</strong>
            <p>
              Built to make API security visible,
              controlled and intelligent.
            </p>
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <span className="footer-heading">PRODUCT</span>

            <button type="button">API Gateway</button>
            <button type="button">API Keys</button>
            <button type="button">Request Monitor</button>
            <button type="button">Analytics</button>
          </div>

          <div className="footer-column">
            <span className="footer-heading">SECURITY</span>

            <button type="button">Documentation</button>
            <button type="button">Security</button>
            <button type="button">Privacy Policy</button>
            <button type="button">Terms & Conditions</button>
          </div>

          <div className="footer-column">
            <span className="footer-heading">CONNECT</span>

            <button type="button">Contact</button>
            <button type="button">Support</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          © 2026 Smart API Guard. All rights reserved.
        </span>

        <span className="footer-version">
          SMART API GUARD · v1.0
        </span>
      </div>
    </footer>
  );
}

export default Footer;