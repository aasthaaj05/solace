import React, { useState, useEffect } from 'react';
import FadeIn from './fade-in';
import { Heart, Calendar, Book, X, Smile, Star } from 'lucide-react';
import './gratitude_wall.css'; // Import the CSS file
import StudNavbar from "../StudNavbar";

const GratitudeSpace = () => {
  const [gratitudes, setGratitudes] = useState([]);
  const [newGratitude, setNewGratitude] = useState('');
  const [isInputActive, setIsInputActive] = useState(false);

  // Load gratitudes from localStorage on mount
  useEffect(() => {
    const savedGratitudes = localStorage.getItem('gratitudes');
    if (savedGratitudes) {
      try {
        setGratitudes(JSON.parse(savedGratitudes));
      } catch (e) {
        console.error("Error loading gratitudes:", e);
      }
    }
  }, []);

  // Save gratitudes to localStorage when they change
  useEffect(() => {
    localStorage.setItem('gratitudes', JSON.stringify(gratitudes));
  }, [gratitudes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newGratitude.trim()) {
      const gratitude = {
        id: Date.now(),
        text: newGratitude,
        date: new Date().toISOString(),
        color: getRandomColor()
      };
      setGratitudes([gratitude, ...gratitudes]);
      setNewGratitude('');
      setIsInputActive(false);
    }
  };

  const handleDelete = (id) => {
    setGratitudes(gratitudes.filter(item => item.id !== id));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getRandomColor = () => {
    const gradients = [
      'linear-gradient(135deg, #F7CFD8, #A6F1E0)', // Soft Pink to Light Aqua
      'linear-gradient(135deg, #FFE6A9, #73C7C7)', // Warm Yellow-Orange to Teal Blue
      'linear-gradient(135deg, #F4F8D3, #F7CFD8)', // Pale Yellow-Green to Soft Pink
      'linear-gradient(135deg, #A6F1E0, #FFE6A9)', // Light Aqua to Warm Yellow-Orange
      'linear-gradient(135deg, #73C7C7, #F4F8D3)', // Teal Blue to Pale Yellow-Green
      'linear-gradient(135deg, #F7CFD8, #73C7C7)', // Soft Pink to Teal Blue
      'linear-gradient(135deg, #FFE6A9, #F4F8D3)', // Warm Yellow-Orange to Pale Yellow-Green
      'linear-gradient(135deg, #A6F1E0, #F7CFD8)', // Light Aqua to Soft Pink
    ];
  
    const solidColors = [
      '#F7CFD8', // Soft Pink
      '#A6F1E0', // Light Aqua
      '#FFE6A9', // Warm Yellow-Orange
      '#73C7C7', // Teal Blue
      '#F4F8D3', // Pale Yellow-Green
    ];
  
    // Randomly choose between gradients and solid colors
    const useGradient = Math.random() > 0.5;
    if (useGradient) {
      return gradients[Math.floor(Math.random() * gradients.length)];
    } else {
      return solidColors[Math.floor(Math.random() * solidColors.length)];
    }
  };

  const getRandomIcon = () => {
    const icons = [
      <Heart size={16} className="icon" />,
      <Smile size={16} className="icon" />,
      <Star size={16} className="icon" />
    ];
    return icons[Math.floor(Math.random() * icons.length)];
  };

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="navbar">
    <StudNavbar />
    <section className="gratitude-space">

      {/* Header Section */}
      <div className="container">
        <FadeIn delay={200}>
          <div className="header">
            <span className="tag">REFLECTION</span>
            <h2 className="title">Gratitude Wall</h2>
            <p className="subtitle">
              Revisit your happy moments to reflect on positivity and gratitude.
              Each note is a reminder of the joy in your life.
            </p>
          </div>
        </FadeIn>
      </div>

      {/* Card Section */}
      <div className="container">
        <FadeIn delay={400}>
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-3">
                <Calendar size={20} className="card-header-icon" />
                <span className="card-header-text">{todayDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Book size={18} className="card-header-icon" />
                <span className="text-sm card-header-text">{gratitudes.length} moments</span>
              </div>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit} className="mb-8">
                <div className={`input-container ${isInputActive ? 'active' : ''}`}>
                  <input
                    type="text"
                    value={newGratitude}
                    onChange={(e) => setNewGratitude(e.target.value)}
                    onFocus={() => setIsInputActive(true)}
                    placeholder="What happy moment are you grateful for today?"
                    className="input-field"
                  />
                  <button
                    type="submit"
                    className={`submit-button ${newGratitude.trim() ? 'active' : 'disabled'}`}
                    disabled={!newGratitude.trim()}
                  >
                    <Heart size={16} className="icon" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Gratitude Wall Section */}
      <div className="container">
        <FadeIn delay={600}>
          <div className="gratitude-wall">
            {gratitudes.length === 0 ? (
              <div className="empty-state">
                <Heart size={40} className="empty-state-icon" />
                <p className="empty-state-text">
                  Add your first gratitude to begin building your wall of happy moments
                </p>
              </div>
            ) : (
              <div className="grid">
                {gratitudes.map((item, index) => (
                  <FadeIn key={item.id} delay={100 + index * 50} duration={400}>
                    <div
  className="gratitude-item"
  style={{
    background: item.color, // Use the dynamically generated color
    transform: `rotate(${Math.random() * 6 - 3}deg)`
  }}
>
  <div className="gratitude-icon">
    {getRandomIcon()}
  </div>
  <p className="gratitude-text">{item.text}</p>
  <div className="gratitude-footer">
    <p className="gratitude-date">
      {formatDate(item.date)}
    </p>
    <button
      onClick={() => handleDelete(item.id)}
      className="delete-button"
      aria-label="Delete gratitude"
    >
      <X size={14} />
    </button>
  </div>
</div>

                  </FadeIn>
                ))}
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
    </div>
  );
};

export default GratitudeSpace;