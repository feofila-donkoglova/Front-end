import React, { useState } from 'react';
import './EditPersonModal.css';

function EditPersonModal({ person, onClose, onSave, relatives = [] }) {
  // Ініціалізуємо стан, одразу витягуючи motherId та fatherId, якщо вони є
  const [formData, setFormData] = useState({
    ...person,
    deathYear: person.deathYear || '',
    birthPlace: person.birthPlace || '',
    education: person.education || '',
    notes: person.notes || '',
    motherId: person.motherId || '',
    fatherId: person.fatherId || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Формуємо фінальний об'єкт для збереження
    const dataToSave = {
      ...formData,
      motherId: formData.motherId || null, // Порожні рядки перетворюємо на null
      fatherId: formData.fatherId || null
    };
    
    // Видаляємо застаріле поле tags, щоб не смітити в базі
    delete dataToSave.tags; 

    onSave(dataToSave); 
  };

  // Фільтруємо список родичів, щоб людина не могла обрати себе як батька/матір
  const availableParents = relatives.filter(r => r.id !== person.id);

  return (
    <div className="edit-panel-container">
      
      <div className="edit-avatar-placeholder">
        <div className="avatar-circle"></div>
      </div>

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
          <label>Дата народження</label>
          <input name="birthYear" value={formData.birthYear} onChange={handleChange} placeholder="12.05.1945 або 1945" />
        </div>
        <div className="edit-row">
          <label>Дата смерті</label>
          <input name="deathYear" value={formData.deathYear} onChange={handleChange} placeholder="20.11.2017 або 2017" />
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

        {/* НОВИЙ БЛОК: Вибір батьків замість тегів */}
        <div className="edit-tags-section">
          <label className="edit-tags-label">Батьки (для ієрархії дерева)</label>
          
          <div className="edit-tags-box parents-box">
            <select name="motherId" value={formData.motherId} onChange={handleChange} className="yellow-select modal-parent-select">
              <option value="">Оберіть матір ▼</option>
              {availableParents.map(r => 
                <option key={r.id} value={r.id}>{r.firstName} {r.lastName}</option>
              )}
            </select>

            <select name="fatherId" value={formData.fatherId} onChange={handleChange} className="yellow-select modal-parent-select">
              <option value="">Оберіть батька ▼</option>
              {availableParents.map(r => 
                <option key={r.id} value={r.id}>{r.firstName} {r.lastName}</option>
              )}
            </select>
          </div>
        </div>

      </div>

      <div className="edit-actions-bottom">
        <button className="red-action-btn" onClick={onClose}>СКАСУВАТИ</button>
        <button className="red-action-btn" onClick={handleSubmit}>ЗБЕРЕГТИ</button>
      </div>

    </div>
  );
}

export default EditPersonModal;