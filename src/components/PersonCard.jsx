import React from 'react';
import './PersonCard.css';

function PersonCard({ person, onDelete, onEdit }) {
  const getAge = (birthDate, deathDate) => {
    if (!birthDate) return '—';
    const birthYearMatch = String(birthDate).match(/\d{4}/);
    if (!birthYearMatch) return '—';
    const bYear = parseInt(birthYearMatch[0]);

    if (deathDate) {
      const deathYearMatch = String(deathDate).match(/\d{4}/);
      if (deathYearMatch) {
        return parseInt(deathYearMatch[0]) - bYear;
      }
    }
    return new Date().getFullYear() - bYear;
  };

  const age = getAge(person.birthYear, person.deathYear);

  return (
    <div className="person-card">
      {/* Іконка аватарки */}
      <div className="avatar-placeholder">
        <svg viewBox="0 0 24 24" fill="#a0a0a0" width="50px" height="50px">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </div>

      {/* Ім'я */}
      <h3 className="person-name">{person.lastName} {person.firstName}</h3>
      
      {/* Вік */}
      <p className="person-age">{age} років</p>
      
      {/* Кнопки */}
      <div className="card-actions">
        <button className="delete-btn" onClick={() => onDelete(person.id)}>
          ВИДАЛИТИ
        </button>
        <button className="edit-btn" onClick={() => onEdit(person)}>
          РЕДАГУВАТИ
        </button>
      </div>
    </div>
  );
}

export default PersonCard;