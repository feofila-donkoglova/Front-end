import React, { useState, useEffect } from 'react';
import { getRelatives, getProfileData } from '../utils/storage.js';
import Xarrow, { Xwrapper } from 'react-xarrows';
import './Tree.css';

function Tree() {
  const [treeGenerations, setTreeGenerations] = useState([]); 
  const [allPeople, setAllPeople] = useState([]);
  const [activePersonId, setActivePersonId] = useState(null);
  const [expandedPersonId, setExpandedPersonId] = useState(null);

  const extractYear = (yearStr) => {
    if (!yearStr) return 0;
    const match = String(yearStr).match(/\d{4}/);
    return match ? parseInt(match[0]) : 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      const relativesData = await getRelatives() || [];
      const profileData = await getProfileData() || {};

      let people = [...relativesData];

      people.push({
        id: "main_profile",
        fullName: profileData.fullName || "Я",
        firstName: profileData.firstName || profileData.fullName?.split(' ')[1] || 'Я',
        isMainUser: true,
        birthYear: profileData.birthYear,
        birthPlace: profileData.birthPlace,
        education: profileData.education,
        notes: profileData.notes,
        motherId: profileData.motherId || null,
        fatherId: profileData.fatherId || null
      });
      
      setAllPeople(people);

      const levels = {};
      people.forEach(p => levels[p.id] = 0); 

      // --- Прорахунок поколінь (Ієрархія: старші зверху) ---
      for (let i = 0; i < 10; i++) {
        
        // Крок 1. Дитина завжди має бути на рівень нижче за батьків
        people.forEach(p => {
          let parentLevels = [];
          if (p.motherId && levels[p.motherId] !== undefined) parentLevels.push(levels[p.motherId]);
          if (p.fatherId && levels[p.fatherId] !== undefined) parentLevels.push(levels[p.fatherId]);

          if (parentLevels.length > 0) {
            const maxParentLevel = Math.max(...parentLevels);
            if (levels[p.id] <= maxParentLevel) {
              levels[p.id] = maxParentLevel + 1;
            }
          }
        });

        // Крок 2. Партнери (ті, хто мають спільну дитину) вирівнюються на одне покоління
        people.forEach(child => {
          if (child.motherId && child.fatherId) {
            const mLevel = levels[child.motherId];
            const fLevel = levels[child.fatherId];
            
            if (mLevel !== undefined && fLevel !== undefined && mLevel !== fLevel) {
              const targetLevel = Math.max(mLevel, fLevel);
              levels[child.motherId] = targetLevel;
              levels[child.fatherId] = targetLevel;
            }
          }
        });
      }

      const grouped = {};
      people.forEach(p => {
        const lvl = levels[p.id];
        if (!grouped[lvl]) grouped[lvl] = [];
        grouped[lvl].push(p);
      });

      // 1. Отримуємо масив рівнів ВІД НАЙМОЛОДШИХ до НАЙСТАРШИХ (знизу вгору)
      const levelsArray = Object.keys(grouped).map(Number).sort((a, b) => b - a);

      // 2. Базовий скор для всіх — це рік народження (щоб на своєму рівні вони сортувались адекватно)
      people.forEach(p => p.orderScore = extractYear(p.birthYear));

      // 3. Проходимося знизу вгору і підтягуємо батьків до їхніх дітей
      levelsArray.forEach((lvl) => {
        // Сортуємо поточний рівень
        grouped[lvl].sort((a, b) => a.orderScore - b.orderScore);
        
        // Фіксуємо координати (множимо на 100, щоб мати крок для зміщення батьків)
        grouped[lvl].forEach((person, index) => {
          person.orderScore = index * 100; 

          // Знаходимо батьків цієї людини і підтягуємо їх по "координаті X" до дитини
          const father = people.find(p => p.id === person.fatherId);
          if (father) father.orderScore = person.orderScore - 10; // Батько стає трохи лівіше від дитини

          const mother = people.find(p => p.id === person.motherId);
          if (mother) mother.orderScore = person.orderScore + 10; // Мати стає трохи правіше від дитини
        });
      });

      // 4. Формуємо фінальний масив для рендеру (тепер сортуємо зверху вниз)
      const sortedGenerations = Object.entries(grouped).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
      
      // Сортуємо не за роком, а за нашою вирахуваною координатою
      sortedGenerations.forEach(gen => gen[1].sort((a, b) => a.orderScore - b.orderScore));
      
      setTreeGenerations(sortedGenerations);
    };
    
    fetchData();
  }, []);

  const getAge = (birthDate, deathDate) => {
    if (!birthDate) return '—';
    const bYear = extractYear(birthDate);
    if (!bYear) return '—';
    if (deathDate) {
      const dYear = extractYear(deathDate);
      if (dYear) return dYear - bYear;
    }
    return new Date().getFullYear() - bYear;
  };

  const handleNodeClick = (e, personId) => {
    e.stopPropagation();
    setActivePersonId(activePersonId === personId ? null : personId);
    setExpandedPersonId(null);
  };

  // --- Побудова зв'язків (фоново) ---
  const arrowElements = [];
  const processedPartnerPairs = new Set();
  
  const validPeopleIds = new Set(allPeople.map(p => p.id));
  const siblingGroups = {};

  allPeople.forEach(person => {
    const validMother = validPeopleIds.has(person.motherId) ? person.motherId : null;
    const validFather = validPeopleIds.has(person.fatherId) ? person.fatherId : null;

    // 1. Лінії до дітей
    if (validMother) arrowElements.push({ start: validMother, end: person.id, type: 'child' });
    if (validFather) arrowElements.push({ start: validFather, end: person.id, type: 'child' });

    // 2. Лінія партнерів
    if (validMother && validFather) {
      const pair = [validMother, validFather].sort().join('|');
      if (!processedPartnerPairs.has(pair)) {
        processedPartnerPairs.add(pair);
        arrowElements.push({ start: validMother, end: validFather, type: 'partner' });
      }
    }

    // 3. Групування для братів і сестер
    if (validMother || validFather) {
      const key = `${validMother || 'none'}_${validFather || 'none'}`;
      if (!siblingGroups[key]) siblingGroups[key] = [];
      siblingGroups[key].push(person);
    }
  });

  // Малюємо пунктирні лінії братів/сестер ЛАНЦЮЖКОМ
  Object.values(siblingGroups).forEach(group => {
    if (group.length > 1) {
      group.sort((a, b) => extractYear(a.birthYear) - extractYear(b.birthYear));
      for (let i = 0; i < group.length - 1; i++) {
        arrowElements.push({ start: group[i].id, end: group[i+1].id, type: 'sibling' });
      }
    }
  });

  return (
    <section className="tree-section" onClick={() => { setActivePersonId(null); setExpandedPersonId(null); }}>
      <h2 className="tree-title">РОДОВІДНЕ ДЕРЕВО</h2>
      <p className="tree-subtitle">Натисніть на іконку, щоб переглянути деталі</p>

      <div className="tree-canvas">
        <Xwrapper>
          {treeGenerations.map(([lvl, persons]) => (
            <div key={lvl} className="tree-generation-row">
              {persons.map(p => {
                const isActive = activePersonId === p.id;
                const isExpanded = expandedPersonId === p.id;

                return (
                  <div 
                    key={p.id} 
                    id={p.id} 
                    className={`tree-node ${isActive ? 'active' : ''}`}
                    onClick={(e) => handleNodeClick(e, p.id)}
                  >
                    <div className="node-icon-wrapper" style={p.isMainUser ? { backgroundColor: '#d0ebff', border: '2px solid #339af0' } : {}}>
                      <svg viewBox="0 0 24 24" fill="#000" width="45px" height="45px">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <div className="node-label" style={{marginTop: '5px', fontWeight: '500'}}>
                      {p.firstName || p.fullName}
                    </div>

                    {isActive && (
                      <div className="person-tooltip" onClick={(e) => e.stopPropagation()}>
                        <h4 className="tooltip-name">{p.fullName || `${p.lastName || ''} ${p.firstName}`.trim()}</h4>
                        <div className="tooltip-meta">
                          <span className="tooltip-age">{getAge(p.birthYear, p.deathYear)} років</span>
                          <span className="tooltip-year">
                            {p.birthYear || 'Дата невідома'} 
                            {p.deathYear ? ` — ${p.deathYear}` : ''}
                          </span>
                        </div>
                        <div className="tooltip-details">
                          {p.birthPlace && <p><strong>Місце народження:</strong> {p.birthPlace}</p>}
                          <p><strong>Освіта:</strong> {p.education || 'Не вказано'}</p>
                        </div>
                        <button className="read-more-btn" onClick={(e) => { e.stopPropagation(); setExpandedPersonId(isExpanded ? null : p.id); }}>
                          {isExpanded ? 'Сховати деталі' : 'Читати більше'}
                        </button>
                        {isExpanded && (
                          <div className="tooltip-tags-area">
                            <p className="tooltip-notes"><strong>Нотатки:</strong> {p.notes || 'Тут буде інформація...'}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {arrowElements.map((arr, i) => (
            <Xarrow
              key={i}
              start={arr.start}
              end={arr.end}
              showHead={false}
              strokeWidth={2}
              color={arr.type === 'sibling' ? "#bbbbbb" : "#444444"}
              dashness={arr.type === 'sibling'}
              path={arr.type === 'child' ? "grid" : "straight"}
              startAnchor={arr.type === 'child' ? "bottom" : ["right", "left", "bottom", "top"]}
              endAnchor={arr.type === 'child' ? "top" : ["left", "right", "bottom", "top"]}
            />
          ))}
        </Xwrapper>
      </div>
    </section>
  );
}

export default Tree;