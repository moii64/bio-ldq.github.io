import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './CVPage.css';

const CVPage: React.FC = () => {
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

  const downloadCV = (format: string) => {
    // In a real implementation, this would link to actual CV files
    alert(`Tính năng tải xuống CV định dạng ${format.toUpperCase()} sẽ được kích hoạt khi bạn thêm file CV thực tế vào thư mục dự án.`);
    
    // Example: If you have actual files, uncomment and modify:
    // const fileUrl = format === 'pdf' ? '/cv.pdf' : '/cv.docx';
    // const link = document.createElement('a');
    // link.href = fileUrl;
    // link.download = `CV.${format}`;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  };

  return (
    <div className="cv-page">
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
            <i className="fas fa-file-alt"></i>
          </div>
          <h1>CV/Resume</h1>
          <p className="subtitle">Tải xuống CV của tôi</p>
          <div className="content">
            <p>Bạn có thể tải xuống CV/Resume của tôi ở các định dạng khác nhau. Chọn định dạng phù hợp với nhu cầu của bạn.</p>
          </div>

          <div className="download-section">
            <div className="download-card" onClick={() => downloadCV('pdf')}>
              <i className="fas fa-file-pdf"></i>
              <h3>PDF Format</h3>
              <p>Định dạng PDF phù hợp để in và chia sẻ</p>
              <button className="download-button" onClick={(e) => { e.stopPropagation(); downloadCV('pdf'); }}>
                <i className="fas fa-download"></i>
                Tải PDF
              </button>
            </div>
            <div className="download-card" onClick={() => downloadCV('docx')}>
              <i className="fas fa-file-word"></i>
              <h3>Word Format</h3>
              <p>Định dạng Word để chỉnh sửa</p>
              <button className="download-button" onClick={(e) => { e.stopPropagation(); downloadCV('docx'); }}>
                <i className="fas fa-download"></i>
                Tải Word
              </button>
            </div>
          </div>

          <div className="preview-section">
            <h2>Xem trước CV</h2>
            <div className="cv-preview">
              <div className="cv-section">
                <h3>Thông tin cá nhân</h3>
                <p><strong>Họ tên:</strong> [Tên của bạn]</p>
                <p><strong>Email:</strong> your.email@example.com</p>
                <p><strong>Điện thoại:</strong> +84 XXX XXX XXX</p>
                <p><strong>Địa chỉ:</strong> [Địa chỉ của bạn]</p>
              </div>
              <div className="cv-section">
                <h3>Kinh nghiệm làm việc</h3>
                <ul>
                  <li>Vị trí công việc 1 - Công ty ABC (2020 - Hiện tại)</li>
                  <li>Vị trí công việc 2 - Công ty XYZ (2018 - 2020)</li>
                </ul>
              </div>
              <div className="cv-section">
                <h3>Học vấn</h3>
                <ul>
                  <li>Đại học ABC - Chuyên ngành XYZ (2014 - 2018)</li>
                </ul>
              </div>
              <div className="cv-section">
                <h3>Kỹ năng</h3>
                <ul>
                  <li>Kỹ năng 1</li>
                  <li>Kỹ năng 2</li>
                  <li>Kỹ năng 3</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVPage;

