import React, { useState, useEffect } from 'react';
import FadeIn from './FadeIn';
import { Heart, Calendar, Book, X, Smile, Star } from 'lucide-react';

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
    const colors = [
      'bg-feelworthy-pink/70', 
      'bg-feelworthy-pink/70', 
      'bg-feelworthy-teal/70', 
      'bg-feelworthy-teal-dark/70'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  const getRandomIcon = () => {
    const icons = [
      <Heart size={16} className="text-white" />,
      <Smile size={16} className="text-white" />,
      <Star size={16} className="text-white" />
    ];
    return icons[Math.floor(Math.random() * icons.length)];
  };
  
  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <section className="py-20 px-6 md:px-10 bg-gradient-to-b from-white to-feelworthy-pink/20">
      <div className="container mx-auto max-w-5xl">
        <FadeIn delay={200}>
          <div className="text-center mb-14">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-feelworthy-pink/30 text-slate-800 inline-block mb-4">
              REFLECTION
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Gratitude Wall</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Revisit your happy moments to reflect on positivity and gratitude.
              Each note is a reminder of the joy in your life.
            </p>
          </div>
        </FadeIn>
        
        <FadeIn delay={400}>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 mb-10">
            <div className="bg-feelworthy-pink/20 p-6 flex items-center justify-between border-b border-feelworthy-pink/30">
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-slate-700" />
                <span className="font-medium text-slate-800">{todayDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Book size={18} className="text-slate-600" />
                <span className="text-sm text-slate-600">{gratitudes.length} moments</span>
              </div>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSubmit} className="mb-8">
                <div className={`relative transition-all duration-300 ${isInputActive ? 'shadow-lg' : 'shadow-md'}`}>
                  <input
                    type="text"
                    value={newGratitude}
                    onChange={(e) => setNewGratitude(e.target.value)}
                    onFocus={() => setIsInputActive(true)}
                    placeholder="What happy moment are you grateful for today?"
                    className={`w-full p-4 pr-12 rounded-lg border transition-all duration-300 outline-none
                      ${isInputActive 
                        ? 'border-feelworthy-pink bg-white shadow-feelworthy-pink/20' 
                        : 'border-slate-200 bg-slate-50'}`}
                  />
                  <button
                    type="submit"
                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center
                      rounded-full transition-colors duration-300
                      ${newGratitude.trim() 
                        ? 'bg-feelworthy-pink text-white' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                    disabled={!newGratitude.trim()}
                  >
                    <Heart size={16} className="fill-current" />
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Gratitude Wall */}
          <div className="min-h-[300px]">
            {gratitudes.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl">
                <Heart size={40} className="mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500">
                  Add your first gratitude to begin building your wall of happy moments
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gratitudes.map((item, index) => (
                  <FadeIn key={item.id} delay={100 + index * 50} duration={400}>
                    <div 
                      className={`${item.color} relative rounded-lg p-4 shadow-md min-h-[120px] 
                        flex flex-col transform transition-transform duration-300 
                        hover:scale-105 hover:shadow-lg`}
                      style={{
                        transform: `rotate(${Math.random() * 6 - 3}deg)`
                      }}
                    >
                      <div className="absolute -right-2 -top-2 w-8 h-8 rounded-full flex items-center justify-center">
                        {getRandomIcon()}
                      </div>
                      <p className="text-black font-medium mb-auto">{item.text}</p>
                      <div className="flex justify-between items-center mt-3">
                        <p className="text-xs text-white/80 font-light">
                          {formatDate(item.date)}
                        </p>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-white/70 hover:text-white transition-colors"
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
  );
};

export default GratitudeSpace;
