import { Link } from 'react-router-dom';
import { FiShoppingBag, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp, FaFacebookF, FaInstagram } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <FiShoppingBag className="footer-logo-icon" />
            <span>NYRA</span>
          </div>
          <p className="footer-tagline">
            Elegance in every thread. Premium ladies&apos; dress collection for every occasion.
          </p>
          <div className="footer-social">
            <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="social-link whatsapp">
              <FaWhatsapp />
            </a>
            <a href="#" className="social-link facebook">
              <FaFacebookF />
            </a>
            <a href="#" className="social-link instagram">
              <FaInstagram />
            </a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/collection">Collection</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Categories</h4>
          <ul>
            <li><Link to="/collection">Gowns</Link></li>
            <li><Link to="/collection">Cocktail Dresses</Link></li>
            <li><Link to="/collection">Bridal</Link></li>
            <li><Link to="/collection">Party Dresses</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contact Us</h4>
          <div className="contact-item">
            <FiPhone />
            <span>+8801791421222</span>
          </div>
          <div className="contact-item">
            <FiMail />
            <span>hello@nyra.com</span>
          </div>
          <div className="contact-item">
            <FiMapPin />
            <span>Bashundhara R/A, Dhaka</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} NYRA. All rights reserved. Crafted with love.</p>
      </div>
    </footer>
  );
}
