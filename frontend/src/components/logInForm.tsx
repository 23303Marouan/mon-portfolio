import { useState } from 'react';
import type { FormEvent } from 'react';

type LogInFormProps = {
  onLogin: (id: string, pwd: string) => void;
};

export default function LogInForm({ onLogin }: LogInFormProps) {
  const [id, setId] = useState<string>("");
  const [pwd, setPwd] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
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
