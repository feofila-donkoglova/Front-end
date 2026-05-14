import React, { useState, useEffect } from 'react';
import { getRelatives, getProfileData, saveProfileData } from '../utils/storage.js';
import "./MyProfile.css";

function Profile() {
  const [relativesList, setRelativesList] = useState([]); // ДОДАНО: Зберігаємо масив родичів
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [profileData, setProfileData] = useState({
    fullName: "",
    birthYear: "",
    birthPlace: "",
    education: "",
    notes: "",
    motherId: "",
    fatherId: "" 
  });

  useEffect(() => {
    const fetchData = async () => {
      const relatives = await getRelatives();
      setRelativesList(relatives); 

      const savedProfile = await getProfileData();
      if (savedProfile) {
        setProfileData({
          ...savedProfile,
          motherId: savedProfile.motherId || "",
          fatherId: savedProfile.fatherId || ""
        }); 
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsEditing(false);
    await saveProfileData(profileData);
  };

  const getRelativeName = (id) => {
    const rel = relativesList.find(r => r.id === id);
    return rel ? `${rel.firstName} ${rel.lastName}` : "Не вказано";
  };

  return (
    <div className="page-wrapper">
      <div className="people-top-bar">
        <div className="hamburger-icon">
          <span></span><span></span><span></span>
        </div>
        <h2 className="main-title">МОЯ СТОРІНКА</h2>
        <div className="spacer"></div>
      </div>

      <div className="profile-container">
        
        <div className="profile-card">
          <div className="profile-avatar">
            <svg viewBox="0 0 24 24" fill="#ccc" width="80px" height="80px">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          
          <div className="profile-info">
            {isLoading ? (
              <p>Завантаження даних...</p>
            ) : isEditing ? (
              <div className="edit-profile-form">
                <input name="fullName" value={profileData.fullName} onChange={handleChange} placeholder="ПІБ" />
                <input name="birthYear" value={profileData.birthYear} onChange={handleChange} placeholder="Рік народження" />
                <input name="birthPlace" value={profileData.birthPlace} onChange={handleChange} placeholder="Місце народження" />
                <input name="education" value={profileData.education} onChange={handleChange} placeholder="Освіта" />
                <textarea name="notes" value={profileData.notes} onChange={handleChange} placeholder="Додайте інформацію про себе..." />
                
                <div className="profile-parents-selects">
                  <label>Моя Матір:</label>
                  <select name="motherId" value={profileData.motherId} onChange={handleChange}>
                    <option value="">Не обрано</option>
                    {relativesList.map(r => <option key={r.id} value={r.id}>{r.firstName} {r.lastName}</option>)}
                  </select>

                  <label>Мій Батько:</label>
                  <select name="fatherId" value={profileData.fatherId} onChange={handleChange}>
                    <option value="">Не обрано</option>
                    {relativesList.map(r => <option key={r.id} value={r.id}>{r.firstName} {r.lastName}</option>)}
                  </select>
                </div>

              </div>
            ) : (
              <div className="view-profile">
                <h3 className="profile-name">{profileData.fullName || 'Ім\'я не вказано'}</h3>
                <p className="profile-year">{profileData.birthYear}</p>
                <div className="profile-details-list">
                  <p><span>Місце народження:</span> {profileData.birthPlace || 'Не вказано'}</p>
                  <p><span>Освіта:</span> {profileData.education || 'Не вказано'}</p>
                  
                  <div className="view-parents-block">
                    <p><span>Матір:</span> {getRelativeName(profileData.motherId)}</p>
                    <p><span>Батько:</span> {getRelativeName(profileData.fatherId)}</p>
                  </div>

                  <p className="profile-notes"><span>Нотатки:</span> {profileData.notes || 'Додати інформацію про себе'}</p>
                </div>
              </div>
            )}
            
            {!isLoading && (
              <div className="profile-actions">
                <button 
                  className="yellow-btn" 
                  onClick={() => setIsEditing(true)}
                  style={{ opacity: isEditing ? 0.5 : 1, display: isEditing ? 'none' : 'block' }}
                >
                  РЕДАГУВАТИ
                </button>
                <button 
                  className="yellow-btn" 
                  onClick={handleSave} 
                  style={{ display: isEditing ? 'block' : 'none' }}
                >
                  ЗБЕРЕГТИ
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="stats-card">
          <h3 className="stats-title">СТАТИСТИКА</h3>
          <div className="stats-row">
            <span>Додано родичів:</span>
            <span className="stats-number">{relativesList.length}</span>
          </div>
        </div>
      </div>
      <div className="footer-brand">Family Tree</div>
    </div>
  );
}

export default Profile;