import React, { useState } from 'react';
import './AddPersonForm.css';

function AddPersonForm({ onAdd, relatives = [] }) {
  const [form, setForm] = useState({
    lastName: '',
    firstName: '',
    patronymic: '',
    birthYear: '',
    relationType: '', // Роль (Батько, Матір, Брат...)
    relatedPersonId: '' // ID людини, до якої прив'язуємо
  });

  function handleChange(e) {
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
      relationType: form.relationType,
      relatedPersonId: form.relatedPersonId,
      fullName: `${form.lastName} ${form.firstName} ${form.patronymic}`.trim()
    };

    onAdd(person);
    setForm({ lastName: '', firstName: '', patronymic: '', birthYear: '', relationType: '', relatedPersonId: '' });
  }

  return (
    <div className="inline-add-form">
      <div className="inputs-row">
        <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Прізвище" />
        <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Ім'я" />
        <input name="patronymic" value={form.patronymic} onChange={handleChange} placeholder="По-батькові" />
        <input name="birthYear" type="number" value={form.birthYear} onChange={handleChange} placeholder="Рік народження" />
        
        {/* Вибір ролі (тега) */}
        <select name="relationType" value={form.relationType} onChange={handleChange} className="parent-select">
          <option value="">-- Ким доводиться? --</option>
          <option value="Батько">Батько для...</option>
          <option value="Матір">Матір для...</option>
          <option value="Син">Син для...</option>
          <option value="Дочка">Дочка для...</option>
          <option value="Брат">Брат для...</option>
          <option value="Сестра">Сестра для...</option>
        </select>

        {/* Вибір існуючого родича */}
        <select 
          name="relatedPersonId" 
          value={form.relatedPersonId} 
          onChange={handleChange} 
          className="parent-select"
          disabled={!form.relationType} /* Блокуємо, поки не обрали роль */
        >
          <option value="">-- Оберіть родича --</option>
          {relatives.map(r => <option key={r.id} value={r.id}>{r.fullName}</option>)}
        </select>
      </div>
      <button className="add-submit-btn" onClick={handleSubmit}>ДОДАТИ</button>
    </div>
  );
}

export default AddPersonForm;