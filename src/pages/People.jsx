import React, { useState, useEffect } from 'react';
import { getRelatives, saveRelative, deleteRelativeFromDB, updateRelativeInDB } from '../utils/storage.js';
import AddPersonForm from '../components/AddPersonForm.jsx';
import PersonCard from '../components/PersonCard.jsx';
import './People.css';

function People() {
  const [relatives, setRelatives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Тимчасова функція, щоб не було помилки, поки ми не створили модалку
  const handleEditClick = (person) => {
    console.log("Редагуємо:", person);
    alert("Кнопка працює! Скоро тут буде форма для " + person.firstName);
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