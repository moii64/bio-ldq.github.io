import React, { useState, useRef, useEffect } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import './Profile.css';

const Profile = () => {
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem('profileImage') || 'https://via.placeholder.com/140x140/6366f1/ffffff?text=👤'
  );
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const cropperRef = useRef(null);
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCropImage(e.target.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      const croppedCanvas = cropperRef.current.getCroppedCanvas({
        width: 280,
        height: 280
      });
      const croppedImageUrl = croppedCanvas.toDataURL('image/png');
      setProfileImage(croppedImageUrl);
      localStorage.setItem('profileImage', croppedImageUrl);
      setShowCropModal(false);
      setCropImage(null);
    }
  };

  useEffect(() => {
    if (showCropModal && cropImage && imageRef.current) {
      cropperRef.current = new Cropper(imageRef.current, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 0.8,
        restore: false,
        guides: true,
        center: true,
        highlight: false,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
      });
    }

    return () => {
      if (cropperRef.current) {
        cropperRef.current.destroy();
        cropperRef.current = null;
      }
    };
  }, [showCropModal, cropImage]);

  const profileName = localStorage.getItem('profileName') || 'Tên của bạn';
  const profileBio = localStorage.getItem('profileBio') || 'Mô tả ngắn gọn về bản thân và mục tiêu của bạn';

  return (
    <>
      <div className="profile-section">
        <div className="profile-image" onClick={handleImageClick}>
          <img src={profileImage} alt="Profile" id="profileImg" />
          <div className="profile-img-overlay">
            <i className="fas fa-camera"></i>
            <span>Thay đổi ảnh</span>
          </div>
        </div>
        <h1 className="profile-name">{profileName}</h1>
        <p className="profile-bio">{profileBio}</p>
      </div>

      <div className="social-links">
        <a href="#" className="social-icon" title="Facebook">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="#" className="social-icon" title="Instagram">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="#" className="social-icon" title="Twitter">
          <i className="fab fa-twitter"></i>
        </a>
        <a href="#" className="social-icon" title="LinkedIn">
          <i className="fab fa-linkedin-in"></i>
        </a>
        <a href="#" className="social-icon" title="GitHub">
          <i className="fab fa-github"></i>
        </a>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {showCropModal && (
        <div className="crop-modal show">
          <div className="crop-modal-content">
            <div className="crop-modal-header">
              <h2><i className="fas fa-crop"></i> Cắt ảnh đại diện</h2>
              <button className="crop-close-btn" onClick={() => setShowCropModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="crop-modal-body">
              <div className="crop-container">
                <img ref={imageRef} src={cropImage} alt="Crop" style={{ maxWidth: '100%' }} />
              </div>
            </div>
            <div className="crop-modal-footer">
              <button className="crop-btn crop-btn-secondary" onClick={() => setShowCropModal(false)}>
                Hủy
              </button>
              <button className="crop-btn crop-btn-primary" onClick={handleCrop}>
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;

