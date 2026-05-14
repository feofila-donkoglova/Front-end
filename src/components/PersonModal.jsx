import React, { useState } from 'react';
import './PersonModal.css';

function PersonModal({ person, onClose, onUpdate }) {
  const [editData, setEditData] = useState({ ...person });

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
        
        <h2>Редагування: {person.lastName} {person.firstName}</h2>
        <p style={{marginBottom: '20px', color: '#666'}}>Рік народження: {person.birthYear || '—'}</p>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          <div>
            <label style={{fontWeight: 'bold', fontSize: '0.9rem'}}>Освіта</label>
            <input 
              name="education" 
              value={editData.education || ''} 
              onChange={handleChange} 
              placeholder="Вкажіть освіту..."
              style={{width: '100%', padding: '8px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc'}}
            />
          </div>

          <div>
            <label style={{fontWeight: 'bold', fontSize: '0.9rem'}}>Нотатки</label>
            <textarea 
              name="notes" 
              value={editData.notes || ''} 
              onChange={handleChange} 
              placeholder="Додайте цікаві факти чи нотатки..."
              style={{width: '100%', padding: '8px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc', minHeight: '80px'}}
            />
          </div>
        </div>

        <button 
          onClick={handleSave}
          style={{width: '100%', padding: '10px', marginTop: '25px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer'}}
        >
          Зберегти зміни
        </button>
      </div>
    </div>
  );
}

export default PersonModal;