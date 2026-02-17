import './Footer.css';

function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-brand">
          <div className="footer-logo">🛒 ModernGo</div>
          <p>Your one-stop shop for fresh groceries delivered to your door.</p>
          <div className="footer-social">
            <a href="#">📘</a>
            <a href="#">📸</a>
            <a href="#">🐦</a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/store">Store</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>📧 support@moderngo.com</p>
          <p>📞 +20 100 000 0000</p>
          <p>📍 Cairo, Egypt</p>
        </div>
      </footer>

      <div className="footer-bottom">
        © {new Date().getFullYear()} ModernGo. All rights reserved.
      </div>
    </>
  );
}

export default Footer;