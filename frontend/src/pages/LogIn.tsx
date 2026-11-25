import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LogInForm from '../components/logInForm';

const ID = '23303@ecam.be';
const PWD = 'Marouan';

export default function LogIn() {
  const { isAdmin, setIsAdmin } = useAuth();
  const [error, setError] = useState<string>("");

  const handleLogin = (id: string, pwd: string) => {
    if (id === ID && pwd === PWD) {
      setIsAdmin(true);
      setError("");
    } else {
      setError("Identifiant ou mot de passe incorrect");
    }
  };

  return (
    <main className="container">
      <h1>Connexion</h1>

      {isAdmin ? (
        <>
          <p>Vous êtes connecté.</p>
          <button onClick={() => setIsAdmin(false)}>Se déconnecter</button>
        </>
      ) : (
        <>
          <LogInForm onLogin={handleLogin} />
          {error && <p>{error}</p>}
        </>
      )}
    </main>
  );
}
