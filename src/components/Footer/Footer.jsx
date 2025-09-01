import './Footer.css'

export default function Footer({
  author = 'Name Surname',
  year = new Date().getFullYear(),
}) {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <span className="footer__author">Developed by {author}</span>
        <span className="footer__year">{year}</span>
      </div>
    </footer>
  )
}
