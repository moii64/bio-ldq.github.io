import React from 'react';
import './ThemeSelector.css';

const ThemeSelector = ({ theme, setTheme }) => {
  const themes = [
    { id: 'gradient', icon: 'fa-palette', title: 'Gradient Theme' },
    { id: 'glassmorphism', icon: 'fa-glass-whiskey', title: 'Glassmorphism Theme' },
    { id: 'neon', icon: 'fa-bolt', title: 'Neon Theme' },
    { id: 'minimal', icon: 'fa-circle', title: 'Minimal Theme' },
    { id: 'nature', icon: 'fa-leaf', title: 'Nature Theme' },
    { id: 'sunset', icon: 'fa-sun', title: 'Sunset Theme' }
  ];

  return (
    <div className="theme-selector">
      {themes.map(t => (
        <button
          key={t.id}
          className={`theme-btn ${theme === t.id ? 'active' : ''}`}
          onClick={() => setTheme(t.id)}
          title={t.title}
        >
          <i className={`fas ${t.icon}`}></i>
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;

