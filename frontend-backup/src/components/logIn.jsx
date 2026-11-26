import { useState } from 'react';

export default function LogInForm({ onLogin }) {
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(id, pwd);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Identifiant"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
      />
      <button className="login" type="submit">Se connecter</button>
    </form>
  );
}