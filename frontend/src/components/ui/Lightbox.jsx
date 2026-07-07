// frontend/src/components/Lightbox.jsx
import React, { useState, useEffect } from 'react';

const Lightbox = ({ images, currentIndex, onClose }) => {
  const [current, setCurrent] = useState(currentIndex);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'ArrowLeft') {
        setCurrent((prev) => (prev - 1 + images.length) % images.length);
      }
      if (e.key === 'ArrowRight') {
        setCurrent((prev) => (prev + 1) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images, onClose]);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const handleClickOutside = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleTouchStart = (e) => {
    const startX = e.touches[0].clientX;
    const handleTouchEnd = (e2) => {
      const endX = e2.changedTouches[0].clientX;
      if (startX - endX > 50) {
        handleNext();
      } else if (endX - startX > 50) {
        handlePrev();
      }
      window.removeEventListener('touchend', handleTouchEnd);
    };
    window.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div
      className="lightbox"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.95)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
      onClick={handleClickOutside}
      onTouchStart={handleTouchStart}
    >
      {/* Кнопка "Назад" */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          transition: 'background 0.3s',
        }}
      >
        <svg width="24" height="24" fill="white">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>

      {/* Текущее фото */}
      <img
        src={images[current]}
        alt={`Фото ${current + 1}`}
        style={{
          maxWidth: '90%',
          maxHeight: '90%',
          objectFit: 'contain',
          boxShadow: '0 0 30px rgba(0,0,0,0.5)',
          transition: 'transform 0.3s ease',
        }}
      />

      {/* Кнопка "Вперед" */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        style={{
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          transition: 'background 0.3s',
        }}
      >
        <svg width="24" height="24" fill="white">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        </svg>
      </button>

      {/* Индикатор: Фото 1 из 5 */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          color: 'white',
          fontSize: '1rem',
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: '5px 15px',
          borderRadius: '20px',
        }}
      >
        Фото {current + 1} из {images.length}
      </div>
    </div>
  );
};

export default Lightbox;
