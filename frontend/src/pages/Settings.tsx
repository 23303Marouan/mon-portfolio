import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { User } from 'lucide-react';
import { MailPen } from 'lucide-react';
import '@flaticon/flaticon-uicons/css/brands/all.css';

export default function Settings() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="menu-btn"
        aria-label="Ouvrir le menu"
        onClick={() => setOpen(true)}
      >
        <Menu size={40} strokeWidth={1.75} />
      </button>

      <div
        className={`overlay ${open ? "visible" : ""}`}
        onClick={() => setOpen(false)}
      />

      <aside className={`drawer ${open ? "open" : ""}`}>
        <button
          className="drawer-close"
          aria-label="Fermer le menu"
          onClick={() => setOpen(false)}
        >
          <X size={32} />
        </button>

        <ul className="drawer-nav">
          <li>
            <NavLink to="/login" onClick={() => setOpen(false)}>
              <User /> Se connecter
            </NavLink>
          </li>
          <li>
             <a href="mailto:23303@ecam.be"><MailPen /> E-mail</a>
          </li>
          <li>
            <a href="https://discord.com/users/TON_ID" target="_blank" rel="noreferrer">
               <i className="fi fi-brands-discord"></i> Discord
            </a>
          </li>
        </ul>
      </aside>
    </>
  );
}