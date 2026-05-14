import React, { useState, useEffect } from 'react';
import { getRelatives, getProfileData } from '../utils/storage.js';
import Xarrow, { Xwrapper } from 'react-xarrows';
import './Tree.css';

function Tree() {
  const [treeGenerations, setTreeGenerations] = useState([]); 
  const [allRelativesFlat, setAllRelativesFlat] = useState([]); 
  const [activePersonId, setActivePersonId] = useState(null);
  const [expandedPersonId, setExpandedPersonId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const relativesData = await getRelatives();
      const profileData = await getProfileData();

      let allPeople = [...relativesData];

      // Додаємо головного користувача, використовуючи ТІ САМІ універсальні теги
      if (profileData) {
        const mainUserTags = [];
        if (profileData.motherId) mainUserTags.push({ role: 'Матір', relatedPersonId: profileData.motherId });
        if (profileData.fatherId) mainUserTags.push({ role: 'Батько', relatedPersonId: profileData.fatherId });

        const mainUser = {
          id: "main_profile",
          fullName: profileData.fullName,
          birthYear: profileData.birthYear,
          birthPlace: profileData.birthPlace,
          education: profileData.education,
          notes: profileData.notes,
          isMainUser: true,
          tags: mainUserTags 
        };
        allPeople.push(mainUser);
      }

      setAllRelativesFlat(allPeople);

      const levels = {};
      allPeople.forEach(p => levels[p.id] = 0);

      // СУПЕР-ПРОСТА МАТЕМАТИКА ПОКОЛІНЬ
      for(let i = 0; i < 5; i++) {
        allPeople.forEach(p => {
          if (p.tags) {
            p.tags.forEach(t => {
              // Якщо людина (p) має тег "Матір/Батько", значить ця людина є ДИТИНОЮ.
              // Отже, її батько/матір (relatedPersonId) йде на поверх ВИЩЕ (-1)
              if (t.role === 'Матір' || t.role === 'Батько') {
                levels[t.relatedPersonId] = levels[p.id] - 1; 
              }
            });
          }
        });
      }

      const grouped = {};
      allPeople.forEach(p => {
        const lvl = levels[p.id];
        if (!grouped[lvl]) grouped[lvl] = [];
        grouped[lvl].push(p);
      });

      const sortedGenerations = Object.entries(grouped).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
      
      sortedGenerations.forEach(gen => {
        gen[1].sort((a, b) => {
          const yearA = a.birthYear ? parseInt(String(a.birthYear).match(/\d{4}/)?.[0] || 0) : 0;
          const yearB = b.birthYear ? parseInt(String(b.birthYear).match(/\d{4}/)?.[0] || 0) : 0;
          return yearA - yearB;
        });
      });

      setTreeGenerations(sortedGenerations);
    };
    
    fetchData();
  }, []);

  const getAge = (birthDate, deathDate) => {
    if (!birthDate) return '—';
    const birthYearMatch = String(birthDate).match(/\d{4}/);
    if (!birthYearMatch) return '—';
    const bYear = parseInt(birthYearMatch[0]);

    if (deathDate) {
      const deathYearMatch = String(deathDate).match(/\d{4}/);
      if (deathYearMatch) return parseInt(deathYearMatch[0]) - bYear;
    }
    return new Date().getFullYear() - bYear;
  };

  const handleBackgroundClick = () => {
    setActivePersonId(null);
    setExpandedPersonId(null);
  };

  // Спрощена логіка пошуку дідусів/бабусь на основі однонаправлених тегів
  const getComputedTags = (targetPerson) => {
    const computedTags = [];
    if (!targetPerson.tags) return computedTags;

    // Знаходимо ID безпосередніх батьків
    const parentIds = targetPerson.tags
      .filter(t => t.role === 'Матір' || t.role === 'Батько')
      .map(t => t.relatedPersonId);

    // Шукаємо об'єкти батьків, а в них — їхніх батьків (наших дідусів/бабусь)
    parentIds.forEach(parentId => {
      const parentObj = allRelativesFlat.find(r => r.id === parentId);
      if (parentObj && parentObj.tags) {
        parentObj.tags.forEach(gpTag => {
          if (gpTag.role === 'Матір' || gpTag.role === 'Батько') {
            const gpObj = allRelativesFlat.find(r => r.id === gpTag.relatedPersonId);
            if (gpObj) {
              computedTags.push({
                role: gpTag.role === 'Матір' ? 'Бабуся' : 'Дідусь',
                relatedPersonName: gpObj.firstName,
                isComputed: true
              });
            }
          }
        });
      }
    });

    return computedTags;
  };

  return (
    <section className="tree-section" onClick={handleBackgroundClick}>
      <h2 className="tree-title">РОДОВІДНЕ ДЕРЕВО</h2>
      <p className="tree-subtitle">Натисніть на іконку, щоб переглянути деталі</p>

      <div className="tree-canvas">
        <Xwrapper>
          
          {treeGenerations.map(([levelNum, personsInLevel]) => (
            <div key={`level-${levelNum}`} className="tree-generation-row">
              
              {personsInLevel.map((person) => {
                const isActive = activePersonId === person.id;
                const isExpanded = expandedPersonId === person.id;
                
                // Фільтруємо старі помилкові теги (Син/Донька), якщо вони залишились у БД
                const cleanTags = (person.tags || []).filter(t => t.role !== 'Син' && t.role !== 'Донька');
                const computedTags = getComputedTags(person);
                const allTags = [...cleanTags, ...computedTags];

                return (
                  <div 
                    key={person.id} 
                    id={person.id}
                    className={`tree-node ${isActive ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePersonId(isActive ? null : person.id);
                      if (!isActive) setExpandedPersonId(null);
                    }}
                  >
                    <div className="node-icon-wrapper" style={person.isMainUser ? { backgroundColor: '#d0ebff', border: '2px solid #339af0' } : {}}>
                      <svg viewBox="0 0 24 24" fill={person.isMainUser ? "#000" : "#000"} width="45px" height="45px">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>

                    {isActive && (
                      <div className="person-tooltip" onClick={(e) => e.stopPropagation()}>
                        <h4 className="tooltip-name">{person.fullName}</h4>
                        <div className="tooltip-meta">
                          <span className="tooltip-age">{getAge(person.birthYear, person.deathYear)} років</span>
                          <span className="tooltip-year">
                            {person.birthYear || 'Дата невідома'} 
                            {person.deathYear ? ` — ${person.deathYear}` : ''}
                          </span>
                        </div>
                        
                        <div className="tooltip-details">
                          {person.birthPlace && <p><strong>Місце народження:</strong> {person.birthPlace}</p>}
                          <p><strong>Освіта:</strong> {person.education || 'Не вказано'}</p>
                        </div>

                        <button className="read-more-btn" onClick={(e) => { e.stopPropagation(); setExpandedPersonId(isExpanded ? null : person.id); }}>
                          {isExpanded ? 'Сховати деталі' : 'Читати більше'}
                        </button>

                        {isExpanded && (
                          <div className="tooltip-tags-area">
                            <p className="tooltip-notes"><strong>Родинні зв'язки:</strong></p>
                            {allTags.length > 0 ? (
                              <div className="tags-display-small">
                                {allTags.map((tag, i) => (
                                  <span key={i} className={`tag-pill-small ${tag.isComputed ? 'computed-tag' : ''}`}>
                                    #{tag.role}: {tag.relatedPersonName} {tag.isComputed && '✨'}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p style={{fontSize: '0.85rem', color: '#888'}}>Зв'язки не додані</p>
                            )}
                            <p className="tooltip-notes" style={{marginTop: '10px'}}><strong>Нотатки:</strong> {person.notes || 'Тут буде інформація...'}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* МАЛЮВАННЯ СТРІЛОК ЗА ВАШОЮ ЛОГІКОЮ */}
          {allRelativesFlat.map((person) => {
            if (!person.tags) return null;
            
            return person.tags
              // Ігноруємо старі теги Син/Донька, якщо вони є в базі, щоб не ламати графіку
              .filter(tag => tag.role === 'Матір' || tag.role === 'Батько' || tag.role === 'Брат' || tag.role === 'Сестра')
              .map((tag, index) => {
                let startNode, endNode, isDashed;

                if (tag.role === 'Матір' || tag.role === 'Батько') {
                  startNode = tag.relatedPersonId; // Батько/Мати (зверху)
                  endNode = person.id;             // Дитина (знизу)
                  isDashed = false;
                } else {
                  // Для братів і сестер лінія йде між ними (пунктиром)
                  startNode = person.id;
                  endNode = tag.relatedPersonId;
                  isDashed = true;
                }

                return (
                  <Xarrow
                    key={`arrow-${person.id}-${index}`}
                    start={startNode}
                    end={endNode}
                    color="#a88b68"
                    strokeWidth={2}
                    path="grid"
                    dashness={isDashed}
                    showHead={false}
                  />
                );
              });
          })}
        </Xwrapper>
      </div>
    </section>
  );
}

export default Tree;