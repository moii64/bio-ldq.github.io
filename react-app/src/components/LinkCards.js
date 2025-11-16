import React from 'react';
import { Link } from 'react-router-dom';
import './LinkCards.css';

const LinkCards = () => {
  const links = [
    {
      to: '/payment',
      icon: 'fa-credit-card',
      title: 'Thanh toán',
      subtitle: 'Thanh toán an toàn và bảo mật',
      special: true
    },
    {
      to: '/tasks',
      icon: 'fa-tasks',
      title: 'Quản lý nhiệm vụ',
      subtitle: 'Xem và quản lý tất cả nhiệm vụ',
      special: true
    },
    {
      to: '/special-link',
      icon: 'fa-star',
      title: 'Liên kết đặc biệt',
      subtitle: 'Mô tả ngắn gọn',
      special: true
    },
    {
      to: '/website',
      icon: 'fa-globe',
      title: 'Website chính',
      subtitle: 'Khám phá thêm về tôi'
    },
    {
      to: '/contact',
      icon: 'fa-envelope',
      title: 'Liên hệ',
      subtitle: 'Gửi email cho tôi'
    },
    {
      to: '/cv',
      icon: 'fa-file-alt',
      title: 'CV/Resume',
      subtitle: 'Tải xuống CV của tôi'
    }
  ];

  return (
    <div className="links-container">
      {links.map((link, index) => {
        const LinkComponent = link.to.startsWith('#') ? 'a' : Link;
        const props = link.to.startsWith('#') 
          ? { href: link.to }
          : { to: link.to };

        return (
          <LinkComponent
            key={index}
            {...props}
            className={`link-card ${link.special ? 'special' : ''}`}
          >
            <div className="link-icon">
              <i className={`fas ${link.icon}`}></i>
            </div>
            <div className="link-content">
              <span className="link-title">{link.title}</span>
              <span className="link-subtitle">{link.subtitle}</span>
            </div>
            <div className="link-arrow">
              <i className="fas fa-arrow-right"></i>
            </div>
          </LinkComponent>
        );
      })}
    </div>
  );
};

export default LinkCards;

