type TacheProps = {
  name: string;
  id: number;
  deleteTache: (id: number) => void;
  isAdmin: boolean;
};

export default function Tache({ name, id, deleteTache, isAdmin }: TacheProps) {
  return (
    <li>
      {name}
      {isAdmin && <button onClick={() => deleteTache(id)}>X</button>}
    </li>
  );
}
