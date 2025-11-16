import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import './ContactPage.css';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: typeof formData) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Create mailto link
    const mailtoLink = `mailto:contact@example.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Tên: ${formData.name}\nEmail: ${formData.email}\n\nNội dung:\n${formData.message}`)}`;
    
    window.location.href = mailtoLink;
    
    // Show success message
    alert('Đang mở ứng dụng email của bạn...');
  };

  return (
    <div className="contact-page">
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
            <i className="fas fa-envelope"></i>
          </div>
          <h1>Liên hệ</h1>
          <p className="subtitle">Gửi email cho tôi</p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Tên của bạn</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Nhập tên của bạn"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email của bạn</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Chủ đề</label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                placeholder="Chủ đề email"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Nội dung</label>
              <textarea
                id="message"
                name="message"
                required
                placeholder="Nhập nội dung tin nhắn của bạn..."
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>
            <button type="submit" className="submit-button">
              <i className="fas fa-paper-plane"></i> Gửi email
            </button>
          </form>

          <div className="contact-info">
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <h3>Email</h3>
              <p>contact@example.com</p>
            </div>
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <h3>Điện thoại</h3>
              <p>+84 XXX XXX XXX</p>
            </div>
            <div className="contact-item">
              <i className="fas fa-clock"></i>
              <h3>Thời gian</h3>
              <p>9:00 - 18:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

