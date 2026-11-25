import { useState } from 'react';
import type { Theme } from '../types';

type ThemeListProps = {
  themes: Theme[];
  onDelete: (id: number) => void;
};

function ThemeList({ themes, onDelete }: ThemeListProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <button className="viewThemes" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Masquer les thèmes" : "Afficher les thèmes"}
      </button>

      <br />
      <br />

      {isOpen && (
        <div>
          {themes.map((theme) => (
            <p key={theme.id}>
              {theme.title}

              <button className="deletTheme" onClick={() => onDelete(theme.id)}>
                Supprimer
              </button>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default ThemeList;
