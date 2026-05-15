import React from 'react';
import './Home.css';

function Home() {
  return (
    <section className="hero-section">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">CREATE YOUR HISTORY</h1>
        <p className="hero-subtitle">
          Тут ви можете відтворити історію своєї родини.<br/>
          Щоб назавжди залишити слід у цьому світі для нащадків.
        </p>
        
        <div className="hero-steps" style={{ marginTop: '30px', textAlign: 'left', display: 'inline-block', backgroundColor: 'rgba(0,0,0,0.4)', padding: '20px 40px', borderRadius: '12px' }}>
          <h3 style={{ color: '#f5d76e', marginBottom: '15px', fontSize: '18px' }}>Як розпочати:</h3>
          <ol style={{ color: '#fff', fontSize: '16px', lineHeight: '1.8', paddingLeft: '20px' }}>
            <li>Заповніть інформацію на сторінці "Моя сторінка".</li>
            <li>Додайте найближчих родичів у розділі списку.</li>
            <li>Перейдіть до "Родовідного дерева" для перегляду зв'язків.</li>
          </ol>
        </div>

      </div>
    </section>
  );
}

export default Home;