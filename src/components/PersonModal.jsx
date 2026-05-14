import React, { useState } from 'react';
import './PersonModal.css';

function PersonModal({ person, onClose, onUpdate }) {
  const [editData, setEditData] = useState({ 
    education: person.education || '',
    notes: person.notes || ''
  });

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onUpdate(person.id, editData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="modal-close" onClick={onClose}>&times;</span>

        <h2 className="modal-title">Редагування: {person.lastName} {person.firstName}</h2>
        <p className="modal-subtitle">Рік народження: {person.birthYear || '—'}</p>

        <div className="form-group-modal">
          <label>Освіта:</label>
          <input 
            name="education" 
            value={editData.education} 
            onChange={handleChange} 
            placeholder="Наприклад: КПІ ім. Ігоря Сікорського"
          />
        </div>

        <div className="form-group-modal">
          <label>Нотатки:</label>
          <textarea 
            name="notes" 
            value={editData.notes} 
            onChange={handleChange} 
            placeholder="Додайте цікаві факти чи нотатки..."
          />
        </div>

        <button className="modal-save-btn" onClick={handleSave}>
          Зберегти зміни
        </button>
      </div>
    </div>
  );
}

export default PersonModal;