export default function Tache({ name, id, deleteTache, isAdmin }) {
  return (
    <li>
      {name}
      {isAdmin && <button onClick={() => deleteTache(id)}>X</button>}
    </li>
  );
}