import React, { useState, useEffect } from 'react';

function YearFact({ year }) {
  const [fact, setFact] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!year || isNaN(year)) return;

    const fetchFact = async () => {
      setLoading(true);
      try {
        // Зверни увагу: ми прибрали параметр exintro=1, щоб отримати весь текст
        const url = `https://uk.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&explaintext=1&titles=${year}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Помилка мережі');

        const data = await response.json();
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0]; 

        if (pageId !== '-1' && pages[pageId].extract) {
          const extractText = pages[pageId].extract;
          let finalFact = "";

          // СТРАТЕГІЯ 1: Шукаємо розділ "Події" (найкращий варіант для статей про роки)
          // Використовуємо регулярний вираз, щоб розділити текст по заголовку
          const eventsSplit = extractText.split(/==\s*Події\s*==/);
          
          if (eventsSplit.length > 1) {
            // Беремо текст після заголовку "Події" і розбиваємо на окремі рядки
            const lines = eventsSplit[1].split('\n').map(line => line.trim());
            
            // Шукаємо перший рядок, який є подією (не пустий і не є наступним підзаголовком ===)
            const eventLine = lines.find(line => line.length > 15 && !line.startsWith('='));
            
            if (eventLine) {
              // Відрізаємо можливі маркери списку (* або -) на початку рядка
              finalFact = "Знакова подія: " + eventLine.replace(/^[-*•]\s*/, '');
            }
          }

          // СТРАТЕГІЯ 2: Якщо розділу "Події" раптом немає, фолбек на перше речення
          if (!finalFact) {
            let firstSentence = extractText.split('.')[0];
            // Очищаємо від технічних переносів
            firstSentence = firstSentence.replace(/\n/g, ' ').trim(); 
            
            if (firstSentence.length > 10) {
              finalFact = firstSentence + '.';
            }
          }

          setFact(finalFact || "Цікавих записів про цей рік не знайдено.");
        } else {
          setFact("Історичних записів про цей рік не знайдено.");
        }
      } catch (error) {
        console.error("Помилка завантаження факту:", error);
        setFact("Не вдалося завантажити інформацію.");
      } finally {
        setLoading(false);
      }
    };

    fetchFact();
  }, [year]);

  if (!year) return null;

  return (
    <div className="year-fact-container" style={{
      marginTop: '15px', 
      padding: '12px', 
      backgroundColor: '#f8f9fa', 
      borderRadius: '8px', 
      borderLeft: '4px solid #339af0',
      fontSize: '13px'
    }}>
      <strong style={{ color: '#202b3d' }}>💡 Цей рік в історії:</strong> 
      {loading ? (
        <p style={{ color: '#888', margin: '5px 0 0 0', fontStyle: 'italic' }}>Шукаю в архівах Вікіпедії...</p>
      ) : (
        <p style={{ margin: '5px 0 0 0', color: '#444', lineHeight: '1.4' }}>{fact}</p>
      )}
    </div>
  );
}

export default YearFact;