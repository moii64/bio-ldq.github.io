import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './SpecialLinkPage.css';

const SpecialLinkPage: React.FC = () => {
  const networkLinesRef = useRef<HTMLDivElement>(null);
  const networkDotsRef = useRef<HTMLDivElement>(null);
  const glowingParticlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create network lines
    if (networkLinesRef.current) {
      for (let i = 0; i < 20; i++) {
        const line = document.createElement('div');
        line.className = 'network-line';
        line.style.top = Math.random() * 100 + '%';
        line.style.left = Math.random() * 100 + '%';
        line.style.width = Math.random() * 300 + 200 + 'px';
        line.style.animationDelay = Math.random() * 20 + 's';
        line.style.animationDuration = (Math.random() * 10 + 15) + 's';
        networkLinesRef.current.appendChild(line);
      }
    }

    // Create network dots
    if (networkDotsRef.current) {
      for (let i = 0; i < 50; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.style.left = Math.random() * 100 + '%';
        dot.style.top = Math.random() * 100 + '%';
        dot.style.animationDelay = Math.random() * 5 + 's';
        networkDotsRef.current.appendChild(dot);
      }
    }

    // Create glowing particles
    if (glowingParticlesRef.current) {
      const particleTypes = ['orange', 'yellow', 'purple'];
      for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = `particle ${particleTypes[Math.floor(Math.random() * particleTypes.length)]}`;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        glowingParticlesRef.current.appendChild(particle);
      }
    }
  }, []);

  return (
    <div className="special-link-page">
      {/* Animated Background */}
      <div className="background">
        <div className="network-lines" ref={networkLinesRef}></div>
        <div className="network-dots" ref={networkDotsRef}></div>
        <div className="glowing-particles" ref={glowingParticlesRef}></div>
      </div>

      {/* Main Content */}
      <div className="container">
        <Link to="/" className="back-button">
          <i className="fas fa-arrow-left"></i>
          Quay lại
        </Link>

        <div className="content-card">
          <div className="icon-wrapper">
            <i className="fas fa-star"></i>
          </div>
          <h1>Liên kết đặc biệt</h1>
          <p className="subtitle">Mô tả ngắn gọn</p>
          <div className="content">
            <p>Đây là liên kết đặc biệt của tôi. Nơi bạn có thể khám phá những nội dung độc đáo và thú vị.</p>
          </div>

          <div className="features">
            <div className="feature-item">
              <i className="fas fa-gem"></i>
              <h3>Độc đáo</h3>
              <p>Nội dung đặc biệt</p>
            </div>
            <div className="feature-item">
              <i className="fas fa-sparkles"></i>
              <h3>Nổi bật</h3>
              <p>Điểm nhấn riêng</p>
            </div>
            <div className="feature-item">
              <i className="fas fa-heart"></i>
              <h3>Đặc biệt</h3>
              <p>Dành cho bạn</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialLinkPage;

