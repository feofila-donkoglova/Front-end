import React, { useState } from 'react';
import './EditPersonModal.css';

function EditPersonModal({ person, onClose, onSave }) {
  // Створюємо локальний стан для полів форми
  const [formData, setFormData] = useState({
    ...person,
    education: person.education || '',
    notes: person.notes || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="edit-modal-overlay" onClick={onClose}>
      <div className="edit-modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-x" onClick={onClose}>&times;</span>
        <h2 className="edit-modal-title">Редагувати дані</h2>
        
        <div className="edit-form-group">
          <label>Прізвище та ім'я</label>
          <input 
            name="firstName" 
            value={`${formData.lastName} ${formData.firstName}`} 
            disabled 
            style={{backgroundColor: '#f9f9f9', color: '#888'}}
          />
        </div>

        <div className="edit-form-group">
          <label>Освіта</label>
          <input 
            name="education" 
            value={formData.education} 
            onChange={handleChange} 
            placeholder="Вкажіть навчальний заклад..."
          />
        </div>

        <div className="edit-form-group">
          <label>Нотатки / Біографія</label>
          <textarea 
            name="notes" 
            value={formData.notes} 
            onChange={handleChange} 
            placeholder="Додайте цікаву інформацію про родича..."
          />
        </div>

        <div className="edit-modal-actions">
          <button className="save-btn" onClick={handleSubmit}>ЗБЕРЕГТИ ЗМІНИ</button>
        </div>
      </div>
    </div>
  );
}

export default EditPersonModal;