import { Link } from 'react-router-dom'
import { collections } from '../data/catalog.js'
import BrandLogo from './BrandLogo.jsx'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <BrandLogo variant="footer" />
        <p>
          Ethnic wear rooted in Indian craft, made for everyday elegance and
          gentle occasions.
        </p>
      </div>

      <div className="footer-links">
        <div>
          <h2>Collections</h2>
          {collections.map((collection) => (
            <Link key={collection.slug} to={`/collections/${collection.slug}`}>
              {collection.name}
            </Link>
          ))}
        </div>
        <div>
          <h2>Brand</h2>
          <Link to="/about">About PaaN</Link>
          <Link to="/">Homepage</Link>
        </div>
        <div>
          <h2>Connect</h2>
          <a
            href="https://www.instagram.com/paan_thethreadsofheritage/"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
          <a
            href="https://chat.whatsapp.com/Kg4wRAjYDWZ1aiNauEajiD?s=sw&p=i&mlu=3"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp Community
          </a>
        </div>
        <div>
          <h2>Contact</h2>
          <a href="tel:+919794493545">+91 97944 93545</a>
          <a href="tel:+918679620822">+91 86796 20822</a>
        </div>
      </div>
      <div className="footer-heritage">
        <button
          className="heritage-button"
          type="button"
          onClick={() => alert('Heritage ambience will be available soon.')}
        >
          ♪ Threads of Heritage
        </button>
      </div>
    </footer>
  );
}

export default Footer
