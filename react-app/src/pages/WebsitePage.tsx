import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './WebsitePage.css';

const WebsitePage: React.FC = () => {
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
    <div className="website-page">
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
            <i className="fas fa-globe"></i>
          </div>
          <h1>Website chính</h1>
          <p className="subtitle">Khám phá thêm về tôi</p>
          <div className="content">
            <p>Chào mừng bạn đến với website chính của tôi. Đây là nơi bạn có thể tìm hiểu thêm về công việc, dự án và những điều thú vị khác.</p>
          </div>

          <div className="website-links">
            <a href="#" className="website-link">
              <i className="fas fa-briefcase"></i>
              <h3>Dự án</h3>
              <p>Xem các dự án của tôi</p>
            </a>
            <a href="#" className="website-link">
              <i className="fas fa-user"></i>
              <h3>Giới thiệu</h3>
              <p>Tìm hiểu về tôi</p>
            </a>
            <a href="#" className="website-link">
              <i className="fas fa-blog"></i>
              <h3>Blog</h3>
              <p>Đọc các bài viết</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsitePage;

