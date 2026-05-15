import React, { useState } from 'react';
import './AddPersonForm.css';

function AddPersonForm({ onAdd, relatives = [] }) {
  const [form, setForm] = useState({
    lastName: '', 
    firstName: '', 
    patronymic: '', 
    birthYear: '',
    motherId: '', // Додано поле для матері
    fatherId: ''  // Додано поле для батька
  });

  function handleFormChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit() {
    if (!form.firstName || !form.lastName) {
      alert('Будь ласка, введіть хоча б прізвище та ім\'я');
      return;
    }

    const person = {
      id: crypto.randomUUID(),
      firstName: form.firstName, 
      lastName: form.lastName,
      patronymic: form.patronymic, 
      birthYear: form.birthYear,
      motherId: form.motherId || null, // Зберігаємо null, якщо батька/матір не вказано
      fatherId: form.fatherId || null, 
      fullName: `${form.lastName} ${form.firstName} ${form.patronymic}`.trim()
    };

    onAdd(person);
    
    // Очищення форми після додавання
    setForm({ 
      lastName: '', firstName: '', patronymic: '', birthYear: '', 
      motherId: '', fatherId: '' 
    });
  }

  return (
    <div className="vertical-form">
      <input className="custom-input" name="lastName" value={form.lastName} onChange={handleFormChange} placeholder="Прізвище" />
      <input className="custom-input" name="firstName" value={form.firstName} onChange={handleFormChange} placeholder="Ім'я" />
      <input className="custom-input" name="patronymic" value={form.patronymic} onChange={handleFormChange} placeholder="По-батькові" />
      <input className="custom-input" name="birthYear" type="text" value={form.birthYear} onChange={handleFormChange} placeholder="Дата народження (напр. 12.05.1945 або 1945)" />      
      
      {/* Спрощений блок для вибору батьків */}
      <div className="tags-container-box">
        <div className="tags-selectors">
          <select name="motherId" value={form.motherId} onChange={handleFormChange} className="yellow-select">
            <option value="">Оберіть матір ▼</option>
            {relatives.map(r => (
              <option key={r.id} value={r.id}>{r.firstName} {r.lastName}</option>
            ))}
          </select>

          <select name="fatherId" value={form.fatherId} onChange={handleFormChange} className="yellow-select">
            <option value="">Оберіть батька ▼</option>
            {relatives.map(r => (
              <option key={r.id} value={r.id}>{r.firstName} {r.lastName}</option>
            ))}
          </select>
        </div>
      </div>

      <button className="main-submit-btn" onClick={handleSubmit}>ДОДАТИ</button>
    </div>
  );
}

export default AddPersonForm;