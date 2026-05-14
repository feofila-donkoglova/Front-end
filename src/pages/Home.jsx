import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Підключаємо стилі компонента

function Home() {
  return (
    <section className="hero-section">
      <div className="hero-overlay"></div> {/* Затемнення для кращого читання тексту */}
      <div className="hero-content">
        {/* Виправив друкарську помилку з макету "you" на "your" */}
        <h1 className="hero-title">Create your history</h1>
        <p className="hero-subtitle">
          Тут ви можете відтворити історію своєї родини.<br />
          Щоб назавжди залишити слід у цьому світі для нащадків.
        </p>
        
        {/* Кнопка для швидкого переходу до списку родичів */}
        <Link to="/people" className="cta-button">
          Перейти до родичів
        </Link>
      </div>
    </section>
  );
}

export default Home;