import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Footer.css";

function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-brand">
          <div className="footer-logo-container">
            <img src={logo} alt="ModernGo Logo" className="footer-logo-img" />
            <span className="footer-logo-text">ModernGo</span>
          </div>
          <p className="footer-description">Master your market</p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/store">Store</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p><FiMail className="contact-icon" /> support@moderngo.com</p>
          <p><FiPhone className="contact-icon" /> +20 100 000 0000</p>
          <p><FiMapPin className="contact-icon" /> Cairo, Egypt</p>
        </div>

        <div className="footer-social">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-icon facebook">
            <FaFacebook />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon instagram">
            <FaInstagram />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="social-icon twitter">
            <FaTwitter />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-icon linkedin">
            <FaLinkedin />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="social-icon youtube">
            <FaYoutube />
          </a>
        </div>
      </footer>

      <div className="footer-bottom">
        © {new Date().getFullYear()} ModernGo. All rights reserved.
      </div>
    </>
  );
}

export default Footer;