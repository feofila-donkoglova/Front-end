import React, { useState } from 'react';
import './EditPersonModal.css';

function EditPersonModal({ person, onClose, onSave }) {
  const [formData, setFormData] = useState({
    ...person,
    deathYear: person.deathYear || '',
    birthPlace: person.birthPlace || '',
    education: person.education || '',
    notes: person.notes || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="edit-panel-container">
      
      {/* Кругла аватарка (заглушка) */}
      <div className="edit-avatar-placeholder">
        <div className="avatar-circle"></div>
      </div>

      {/* Список полів */}
      <div className="edit-fields-list">
        <div className="edit-row">
          <label>Прізвище</label>
          <input name="lastName" value={formData.lastName} onChange={handleChange} className="uppercase-text" />
        </div>
        
        <div className="edit-row">
          <label>Ім'я</label>
          <input name="firstName" value={formData.firstName} onChange={handleChange} className="uppercase-text" />
        </div>
        
        <div className="edit-row">
          <label>По-батькові</label>
          <input name="patronymic" value={formData.patronymic} onChange={handleChange} className="uppercase-text" />
        </div>
        
        <div className="edit-row">
          <label>Рік народження</label>
          <input name="birthYear" value={formData.birthYear} onChange={handleChange} />
        </div>
        
        <div className="edit-row">
          <label>Рік смерті</label>
          <input name="deathYear" value={formData.deathYear} onChange={handleChange} placeholder="-" />
        </div>
        
        <div className="edit-row">
          <label>Місце народження</label>
          <input name="birthPlace" value={formData.birthPlace} onChange={handleChange} className="uppercase-text" />
        </div>
        
        <div className="edit-row">
          <label>Освіта</label>
          <input name="education" value={formData.education} onChange={handleChange} className="uppercase-text" />
        </div>
        
        <div className="edit-row">
          <label>Нотатки</label>
          <input name="notes" value={formData.notes} onChange={handleChange} className="normal-text" />
        </div>
      </div>

      {/* Кнопки внизу */}
      <div className="edit-actions-bottom">
        <button className="red-action-btn" onClick={onClose}>СКАСУВАТИ</button>
        <button className="red-action-btn" onClick={() => onSave(formData)}>ЗБЕРЕГТИ</button>
      </div>

    </div>
  );
}

export default EditPersonModal;