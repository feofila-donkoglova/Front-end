import React, { useState, useEffect } from 'react';
import { getRelatives, saveRelative, deleteRelativeFromDB, updateRelativeInDB } from '../utils/storage.js';
import AddPersonForm from '../components/AddPersonForm.jsx';
import PersonCard from '../components/PersonCard.jsx';
import EditPersonModal from '../components/EditPersonModal.jsx'; 
import './People.css';

function People() {
  const [relatives, setRelatives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPerson, setEditingPerson] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await getRelatives();
      setRelatives(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleAddPerson = async (newPerson) => {
    const savedPerson = await saveRelative(newPerson);
    if (savedPerson) {
      setRelatives([...relatives, savedPerson]);
    }
  };

  const handleDelete = async (id) => {
    await deleteRelativeFromDB(id);
    setRelatives(relatives.filter(person => person.id !== id));
  };

  const handleEditClick = (person) => {
    setEditingPerson(person);
  };

  const handleSaveEdit = async (updatedPerson) => {
    await updateRelativeInDB(updatedPerson);
    // Оновлюємо локальний стан, щоб картка змінилася одразу без перезавантаження
    setRelatives(relatives.map(p => p.id === updatedPerson.id ? updatedPerson : p));
    setEditingPerson(null); // Закриваємо панель
  };

  return (
    <section className="people-section">
      <div className="people-container">
        <div className="people-content">
          <div className="form-sidebar">
            <AddPersonForm onAdd={handleAddPerson} relatives={relatives} />
          </div>

          <div className="cards-area">
            {isLoading ? (
              <div className="loading-text">Завантаження даних із сервера...</div>
            ) : editingPerson ? (
              <EditPersonModal
                person={editingPerson}
                onClose={() => setEditingPerson(null)}
                onSave={handleSaveEdit}
                relatives={relatives}
              />
            ) : (
              <div className="cards-grid">
                {relatives.length > 0 ? (
                  relatives.map((person) => (
                    <PersonCard
                      key={person.id}
                      person={person}
                      onDelete={handleDelete}
                      onEdit={handleEditClick}
                    />
                  ))
                ) : (
                  <div className="empty-message">Список родичів порожній.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default People;