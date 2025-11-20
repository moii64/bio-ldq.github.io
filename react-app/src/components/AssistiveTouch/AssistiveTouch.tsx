import React, { useState, useRef, useEffect, useCallback } from 'react';
import './AssistiveTouch.css';

interface User {
  email?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    username?: string;
    avatar_url?: string;
  };
}

interface AssistiveTouchProps {
  menuItems?: Array<{
    label: string;
    icon?: string;
    action: () => void;
  }>;
  position?: { x: number; y: number };
  onPositionChange?: (position: { x: number; y: number }) => void;
  enableHaptic?: boolean;
  enableSound?: boolean;
  snapToEdges?: boolean;
  autoHideOnScroll?: boolean;
  user?: User | null;
  onLogout?: () => void;
}

const AssistiveTouch: React.FC<AssistiveTouchProps> = ({
  menuItems = [
    { label: 'Home', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { label: 'Search', action: () => console.log('Search clicked') },
    { label: 'Settings', action: () => console.log('Settings clicked') },
  ],
  position,
  onPositionChange,
  enableHaptic = true,
  enableSound = false,
  snapToEdges = true,
  autoHideOnScroll = false,
  user = null,
  onLogout,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [currentPosition, setCurrentPosition] = useState(
    position || { x: window.innerWidth - 90, y: window.innerHeight - 160 }
  );
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);
  const [isSnapping, setIsSnapping] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const dragStartTime = useRef(0);
  const lastTapTime = useRef(0);
  const tapCount = useRef(0);

  // Haptic feedback helper
  const triggerHaptic = useCallback((pattern: number | number[] = 10) => {
    if (enableHaptic && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Ignore vibration errors
      }
    }
  }, [enableHaptic]);

  // Sound effect helper
  const playSound = useCallback((type: 'click' | 'open' | 'close' = 'click') => {
    if (enableSound) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      const frequencies = { click: 800, open: 600, close: 400 };
      oscillator.frequency.value = frequencies[type];
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  }, [enableSound]);

  // Snap to edges helper
  const snapToEdge = useCallback((x: number, y: number) => {
    if (!snapToEdges) return { x, y };
    
    const buttonSize = 60;
    const snapThreshold = 50;
    const centerX = window.innerWidth / 2;
    
    // Snap to left or right edge
    if (x < centerX && x < snapThreshold) {
      x = 10;
    } else if (x >= centerX && x > window.innerWidth - buttonSize - snapThreshold) {
      x = window.innerWidth - buttonSize - 10;
    }
    
    // Snap to top or bottom edge
    if (y < snapThreshold) {
      y = 10;
    } else if (y > window.innerHeight - buttonSize - snapThreshold) {
      y = window.innerHeight - buttonSize - 10;
    }
    
    return { x, y };
  }, [snapToEdges]);

  // Lưu vị trí vào localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem('assistiveTouchPosition');
    if (savedPosition) {
      try {
        const pos = JSON.parse(savedPosition);
        setCurrentPosition(pos);
      } catch (e) {
        console.error('Failed to parse saved position', e);
      }
    }
  }, []);

  // Lưu vị trí khi thay đổi
  useEffect(() => {
    if (onPositionChange) {
      onPositionChange(currentPosition);
    }
    localStorage.setItem('assistiveTouchPosition', JSON.stringify(currentPosition));
  }, [currentPosition, onPositionChange]);

  // Auto-hide on scroll
  useEffect(() => {
    if (!autoHideOnScroll) return;
    
    let scrollTimer: NodeJS.Timeout;
    const handleScroll = () => {
      setIsVisible(false);
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, [autoHideOnScroll]);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
        playSound('close');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside as any);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside as any);
    };
  }, [isOpen, playSound]);

  // Xử lý kéo thả - Mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - rect.width / 2;
      const offsetY = e.clientY - rect.top - rect.height / 2;
      
      setDragOffset({ x: offsetX, y: offsetY });
      dragStartPos.current = { x: e.clientX, y: e.clientY };
      dragStartTime.current = Date.now();
      setHasMoved(false);
      setIsDragging(true);
      triggerHaptic(5);
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const deltaX = Math.abs(e.clientX - dragStartPos.current.x);
      const deltaY = Math.abs(e.clientY - dragStartPos.current.y);
      
      if (deltaX > 5 || deltaY > 5) {
        setHasMoved(true);
      }
      
      const newX = e.clientX - dragOffset.x - 30; // 30 = half button width
      const newY = e.clientY - dragOffset.y - 30;
      
      // Giới hạn trong viewport
      const maxX = window.innerWidth - 60;
      const maxY = window.innerHeight - 60;
      
      setCurrentPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    }
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      const dragDuration = Date.now() - dragStartTime.current;
      
      if (hasMoved && dragDuration > 50) {
        // Snap to edge if enabled
        if (snapToEdges) {
          setCurrentPosition(prev => {
            const snapped = snapToEdge(prev.x, prev.y);
            setIsSnapping(true);
            triggerHaptic([10, 20, 10]);
            setTimeout(() => setIsSnapping(false), 300);
            return snapped;
          });
        } else {
          triggerHaptic(5);
        }
      }
      
      setIsDragging(false);
      setHasMoved(false);
    }
  }, [isDragging, hasMoved, snapToEdges, snapToEdge, triggerHaptic]);

  // Xử lý kéo thả - Touch
  const handleTouchStart = (e: React.TouchEvent) => {
    if (buttonRef.current) {
      const touch = e.touches[0];
      const rect = buttonRef.current.getBoundingClientRect();
      const offsetX = touch.clientX - rect.left - rect.width / 2;
      const offsetY = touch.clientY - rect.top - rect.height / 2;
      
      setDragOffset({ x: offsetX, y: offsetY });
      dragStartPos.current = { x: touch.clientX, y: touch.clientY };
      dragStartTime.current = Date.now();
      setHasMoved(false);
      setIsDragging(true);
      triggerHaptic(5);
    }
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging && e.touches.length > 0) {
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - dragStartPos.current.x);
      const deltaY = Math.abs(touch.clientY - dragStartPos.current.y);
      
      if (deltaX > 5 || deltaY > 5) {
        setHasMoved(true);
      }
      
      const newX = touch.clientX - dragOffset.x - 30;
      const newY = touch.clientY - dragOffset.y - 30;
      
      const maxX = window.innerWidth - 60;
      const maxY = window.innerHeight - 60;
      
      setCurrentPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    }
  }, [isDragging, dragOffset]);

  const handleTouchEnd = useCallback(() => {
    if (isDragging) {
      const dragDuration = Date.now() - dragStartTime.current;
      
      if (hasMoved && dragDuration > 50) {
        // Snap to edge if enabled
        if (snapToEdges) {
          setCurrentPosition(prev => {
            const snapped = snapToEdge(prev.x, prev.y);
            setIsSnapping(true);
            triggerHaptic([10, 20, 10]);
            setTimeout(() => setIsSnapping(false), 300);
            return snapped;
          });
        } else {
          triggerHaptic(5);
        }
      }
      
      setIsDragging(false);
      setHasMoved(false);
    }
  }, [isDragging, hasMoved, snapToEdges, snapToEdge, triggerHaptic]);

  // Event listeners cho drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Toggle menu với double tap detection
  const handleButtonClick = (e: React.MouseEvent | React.TouchEvent) => {
    // Chỉ toggle nếu không phải đang drag và không có movement
    if (!isDragging && !hasMoved) {
      e.stopPropagation();
      
      const now = Date.now();
      const timeSinceLastTap = now - lastTapTime.current;
      
      // Double tap để reset position
      if (timeSinceLastTap < 300) {
        tapCount.current++;
        if (tapCount.current === 2) {
          const defaultPos = { x: window.innerWidth - 90, y: window.innerHeight - 160 };
          setCurrentPosition(defaultPos);
          triggerHaptic([10, 50, 10]);
          tapCount.current = 0;
          return;
        }
      } else {
        tapCount.current = 1;
      }
      
      lastTapTime.current = now;
      
      // Toggle menu
      const newIsOpen = !isOpen;
      setIsOpen(newIsOpen);
      
      if (newIsOpen) {
        playSound('open');
        triggerHaptic([10, 20, 10]);
      } else {
        playSound('close');
        triggerHaptic(5);
      }
    }
  };

  // Xử lý click menu item với ripple effect
  const handleMenuItemClick = (action: () => void, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setRipple({ x, y });
    setTimeout(() => setRipple(null), 600);
    
    playSound('click');
    triggerHaptic(10);
    action();
    setIsOpen(false);
  };

  // Ripple effect cleanup
  useEffect(() => {
    if (ripple) {
      const timer = setTimeout(() => setRipple(null), 600);
      return () => clearTimeout(timer);
    }
  }, [ripple]);

  if (!isVisible && autoHideOnScroll) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`assistive-touch-container ${isSnapping ? 'snapping' : ''} ${!isVisible ? 'hidden' : ''}`}
      style={{
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`,
        transition: isDragging ? 'none' : isSnapping ? 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'all 0.2s ease',
      }}
    >
      <div
        ref={buttonRef}
        className={`assistive-touch-button ${isDragging ? 'dragging' : ''} ${isOpen ? 'open' : ''} ${isSnapping ? 'snapping' : ''}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleButtonClick}
        onTouchEnd={handleButtonClick}
      >
        <svg
          className={`menu-icon ${isOpen ? 'open' : ''}`}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isOpen ? (
            // Icon X (close)
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            // Icon menu (hamburger)
            <path
              d="M3 12H21M3 6H21M3 18H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
        
        {/* Ripple effect */}
        {ripple && (
          <span
            className="ripple-effect"
            style={{
              left: `${ripple.x}px`,
              top: `${ripple.y}px`,
            }}
          />
        )}
      </div>

      <div className={`assistive-touch-menu ${isOpen ? 'open' : 'closed'}`}>
        {/* User info header */}
        {user && (
          <div className="assistive-touch-user-header">
            <div className="user-avatar">
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Avatar" />
              ) : (
                <span className="user-avatar-placeholder">
                  {user.user_metadata?.full_name?.[0] || 
                   user.user_metadata?.name?.[0] || 
                   user.email?.[0]?.toUpperCase() || 
                   'U'}
                </span>
              )}
            </div>
            <div className="user-info">
              <div className="user-name">
                {user.user_metadata?.full_name || 
                 user.user_metadata?.name || 
                 user.user_metadata?.username || 
                 user.email?.split('@')[0] || 
                 'User'}
              </div>
              {user.email && (
                <div className="user-email">{user.email}</div>
              )}
            </div>
          </div>
        )}

        {/* Menu items */}
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="assistive-touch-menu-item"
            onClick={(e) => handleMenuItemClick(item.action, e)}
            style={{
              animationDelay: `${(user ? index + 1 : index) * 0.05}s`,
            }}
          >
            {item.icon && <span className="menu-item-icon">{item.icon}</span>}
            <span className="menu-item-label">{item.label}</span>
          </button>
        ))}

        {/* Logout button */}
        {user && onLogout && (
          <button
            className="assistive-touch-menu-item assistive-touch-logout"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                handleMenuItemClick(onLogout, e);
              }
            }}
            style={{
              animationDelay: `${(menuItems.length + (user ? 1 : 0)) * 0.05}s`,
            }}
          >
            <span className="menu-item-icon">🚪</span>
            <span className="menu-item-label">Đăng xuất</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default AssistiveTouch;

