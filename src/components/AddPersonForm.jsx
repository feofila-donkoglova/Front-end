import React, { useState } from 'react';
import './AddPersonForm.css';

function AddPersonForm({ onAdd, relatives = [] }) {
  const [form, setForm] = useState({
    lastName: '', firstName: '', patronymic: '', birthYear: '',
  });
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState({ role: '', relatedPersonId: '' });

  function handleFormChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleTagInputChange(e) {
    setTagInput(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleAddTag(e) {
    e.preventDefault();
    if (!tagInput.role || !tagInput.relatedPersonId) return;

    const relatedPerson = relatives.find(r => r.id === tagInput.relatedPersonId);
    // Робимо коротке ім'я для тегу (наприклад, "Марії")
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

  function handleSubmit() {
    if (!form.firstName || !form.lastName) {
      alert('Будь ласка, введіть хоча б прізвище та ім\'я');
      return;
    }

    const person = {
      id: crypto.randomUUID(),
      firstName: form.firstName, lastName: form.lastName,
      patronymic: form.patronymic, birthYear: form.birthYear,
      tags: tags,
      fullName: `${form.lastName} ${form.firstName} ${form.patronymic}`.trim()
    };

    onAdd(person);
    setForm({ lastName: '', firstName: '', patronymic: '', birthYear: '' });
    setTags([]);
  }

  return (
    <div className="vertical-form">
      <input className="custom-input" name="lastName" value={form.lastName} onChange={handleFormChange} placeholder="Прізвище" />
      <input className="custom-input" name="firstName" value={form.firstName} onChange={handleFormChange} placeholder="Ім'я" />
      <input className="custom-input" name="patronymic" value={form.patronymic} onChange={handleFormChange} placeholder="По-батькові" />
      <input className="custom-input" name="birthYear" type="number" value={form.birthYear} onChange={handleFormChange} placeholder="Рік народження" />
      {/* Білий блок для тегів */}
      <div className="tags-container-box">

        {/* Відображення доданих тегів (сірі) */}
        {tags.length > 0 && (
          <div className="tags-display-area">
            {tags.map((tag, index) => (
              <span key={index} className="tag-pill-gray" onClick={() => handleRemoveTag(index)} title="Натисніть, щоб видалити">
                {tag.displayLabel}
              </span>
            ))}
          </div>
        )}

        {/* Жовті селектори */}
        <div className="tags-selectors">
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
            {relatives.map(r => <option key={r.id} value={r.id}>{r.firstName} {r.lastName}</option>)}
          </select>

          {/* Невеличка кнопка для підтвердження тегу, з'являється тільки коли обрані обидва поля */}
          {tagInput.role && tagInput.relatedPersonId && (
            <button className="confirm-tag-btn" onClick={handleAddTag}>+</button>
          )}
        </div>
      </div>

      <button className="main-submit-btn" onClick={handleSubmit}>ДОДАТИ</button>
    </div>
  );
}

export default AddPersonForm;