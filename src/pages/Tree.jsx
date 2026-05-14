import React, { useState, useEffect } from 'react';
import { getRelatives } from '../utils/storage.js';
import Xarrow, { Xwrapper } from 'react-xarrows';
import './Tree.css';

function Tree() {
  const [relatives, setRelatives] = useState([]);
  const [activePersonId, setActivePersonId] = useState(null);
  const [expandedPersonId, setExpandedPersonId] = useState(null); // Для розгортання "Читати більше"

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRelatives();
      const sortedData = data.sort((a, b) => parseInt(a.birthYear || 0) - parseInt(b.birthYear || 0));
      setRelatives(sortedData);
    };
    fetchData();
  }, []);

  const getAge = (birthYear) => {
    if (!birthYear) return '—';
    return new Date().getFullYear() - parseInt(birthYear);
  };

  const handleBackgroundClick = () => {
    setActivePersonId(null);
    setExpandedPersonId(null);
  };

  // МАГІЯ: Функція автоматичного вираховування бабусь та дідусів
  const getComputedTags = (targetPerson) => {
    const computedTags = [];
    if (!targetPerson.tags) return computedTags;

    const parents = targetPerson.tags.filter(t => t.role === 'Матір' || t.role === 'Батько');

    parents.forEach(parentTag => {
      const parentObj = relatives.find(r => r.id === parentTag.relatedPersonId);
      
      if (parentObj && parentObj.tags) {
        const grandParents = parentObj.tags.filter(t => t.role === 'Матір' || t.role === 'Батько');
        
        grandParents.forEach(gpTag => {
          computedTags.push({
            role: gpTag.role === 'Матір' ? 'Бабуся' : 'Дідусь',
            relatedPersonName: gpTag.relatedPersonName,
            isComputed: true 
          });
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
          {relatives.map((person) => {
            const isActive = activePersonId === person.id;
            const isExpanded = expandedPersonId === person.id;

            // Отримуємо автоматичні теги
            const computedTags = getComputedTags(person);
            const allTags = [...(person.tags || []), ...computedTags];

            return (
              <div 
                key={person.id} 
                id={person.id}
                className={`tree-node ${isActive ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePersonId(isActive ? null : person.id);
                  if (!isActive) setExpandedPersonId(null); // Скидаємо "читати більше" при зміні людини
                }}
              >
                <div className="node-icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="#000" width="45px" height="45px">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>

                {isActive && (
                  <div className="person-tooltip" onClick={(e) => e.stopPropagation()}>
                    <h4 className="tooltip-name">{person.fullName}</h4>
                    
                    <div className="tooltip-meta">
                      <span className="tooltip-age">{getAge(person.birthYear)} років</span>
                      <span className="tooltip-year">
                        {person.birthYear || 'Рік невідомий'} 
                        {person.deathYear ? ` — ${person.deathYear}` : ''}
                      </span>
                    </div>
                    
                    <div className="tooltip-details">
                      {person.birthPlace && (
                        <p><strong>Місце народження:</strong> {person.birthPlace}</p>
                      )}
                      <p><strong>Освіта:</strong> {person.education || 'Не вказано'}</p>
                    </div>
                    
                    <button 
                      className="read-more-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedPersonId(isExpanded ? null : person.id);
                      }}
                    >
                      {isExpanded ? 'Сховати деталі' : 'Читати більше'}
                    </button>

                    {/* Зона з хештегами, яка відкривається */}
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

          {/* МАЛЮВАННЯ ЛІНІЙ ПО МАСИВУ ТЕГІВ */}
          {relatives.map((person) => {
            if (!person.tags || person.tags.length === 0) return null;

            return person.tags.map((tag, index) => {
              let startNode = person.id;
              let endNode = tag.relatedPersonId;
              let isDashed = false;

              // Логіка напрямку: лінія завжди йде від старшого до молодшого
              if (tag.role === 'Матір' || tag.role === 'Батько') {
                startNode = tag.relatedPersonId; // Матір/Батько
                endNode = person.id;             // Дитина
              } else if (tag.role === 'Син' || tag.role === 'Дочка') {
                startNode = person.id;           // Батько/Матір
                endNode = tag.relatedPersonId;   // Дитина
              } else if (tag.role === 'Брат' || tag.role === 'Сестра') {
                isDashed = true;
              }

              return (
                <Xarrow 
                  key={`arrow-${person.id}-${index}`}
                  start={startNode} 
                  end={endNode} 
                  color="#a88b68" 
                  strokeWidth={2} 
                  path="smooth" 
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