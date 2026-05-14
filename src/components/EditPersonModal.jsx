import React, { useState } from 'react';
import './EditPersonModal.css';

function EditPersonModal({ person, onClose, onSave, relatives = [] }) {
  const [formData, setFormData] = useState({
    ...person,
    deathYear: person.deathYear || '',
    birthPlace: person.birthPlace || '',
    education: person.education || '',
    notes: person.notes || ''
  });
  const [tags, setTags] = useState(person.tags || []);
  const [tagInput, setTagInput] = useState({ role: '', relatedPersonId: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  function handleTagInputChange(e) {
    setTagInput(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleAddTag(e) {
    e.preventDefault();
    if (!tagInput.role || !tagInput.relatedPersonId) return;

    const relatedPerson = relatives.find(r => r.id === tagInput.relatedPersonId);
    const shortName = relatedPerson ? relatedPerson.firstName : '...';
    
    const newTag = {
      role: tagInput.role,
      relatedPersonId: tagInput.relatedPersonId,
      relatedPersonName: relatedPerson ? relatedPerson.fullName : 'Невідомо',
      displayLabel: `${tagInput.role} ${shortName}`
    };

    setTags([...tags, newTag]);
    setTagInput({ role: '', relatedPersonId: '' });
  }

  function handleRemoveTag(indexToRemove) {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  }

  const handleSubmit = () => {
    onSave({ ...formData, tags: tags }); 
  };

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

        {/* ДОДАНО: БЛОК РЕДАГУВАННЯ ТЕГІВ */}
        <div className="edit-tags-section">
          <label className="edit-tags-label">Родинні зв'язки</label>
          
          <div className="edit-tags-box">
            {tags.length > 0 && (
              <div className="tags-display-area" style={{marginBottom: '15px'}}>
                {tags.map((tag, index) => (
                  <span key={index} className="tag-pill-gray" onClick={() => handleRemoveTag(index)} title="Видалити">
                    {tag.displayLabel}
                  </span>
                ))}
              </div>
            )}

            <div className="tags-selectors" style={{flexDirection: 'row', gap: '10px', alignItems: 'center'}}>
              <select name="role" value={tagInput.role} onChange={handleTagInputChange} className="yellow-select">
                <option value="">Ким доводиться: ▼</option>
                <option value="Матір">Матір</option>
                <option value="Батько">Батько</option>
                <option value="Син">Син</option>
                <option value="Донька">Донька</option>
                <option value="Брат">Брат</option>
                <option value="Сестра">Сестра</option>
              </select>

              <select name="relatedPersonId" value={tagInput.relatedPersonId} onChange={handleTagInputChange} className="yellow-select">
                <option value="">Кому ▼</option>
                {/* Виключаємо саму людину зі списку, щоб вона не додала тег сама на себе */}
                {relatives.filter(r => r.id !== person.id).map(r => 
                  <option key={r.id} value={r.id}>{r.firstName} {r.lastName}</option>
                )}
              </select>

              {tagInput.role && tagInput.relatedPersonId && (
                <button className="confirm-tag-btn" onClick={handleAddTag}>+</button>
              )}
            </div>
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