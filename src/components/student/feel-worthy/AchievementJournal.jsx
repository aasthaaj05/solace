import React, { useState, useEffect } from 'react';
import FadeIn from './FadeIn';
import ProgressRing from './ProgressRing';
import { PlusCircle, Award, Trash2 } from 'lucide-react';

const AchievementJournal = () => {
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Load achievements from localStorage on component mount
  useEffect(() => {
    const savedAchievements = localStorage.getItem('achievements');
    if (savedAchievements) {
      try {
        setAchievements(JSON.parse(savedAchievements));
      } catch (e) {
        console.error("Error loading achievements:", e);
      }
    }
  }, []);

  // Save achievements to localStorage when they change
  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(achievements));
  }, [achievements]);

  const handleAddAchievement = (e) => {
    e.preventDefault();
    if (newAchievement.trim()) {
      const achievement = {
        id: Date.now(),
        text: newAchievement,
        date: new Date().toISOString(),
      };
      setAchievements([achievement, ...achievements]);
      setNewAchievement('');
      setIsFormVisible(false);
    }
  };

  const handleDeleteAchievement = (id) => {
    setAchievements(achievements.filter(achievement => achievement.id !== id));
  };

  return (
    <section id="achievement-journal" className="py-20 px-6 md:px-10 bg-white">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row items-start gap-12">
          <div className="w-full md:w-1/3">
            <FadeIn delay={200} direction="right">
              <h2 className="text-3xl font-bold mb-4 text-slate-800">Achievement Journal</h2>
              <p className="text-slate-600 mb-8">
                Record your wins, no matter how small. Each achievement is a step towards your growth.
              </p>
              
              <div className="flex justify-center mb-8">
                <ProgressRing 
                  progress={Math.min(achievements.length * 10, 100)} 
                  color="#73C7C7"
                  size={140}
                >
                  <div className="text-center">
                    <span className="block text-3xl font-bold text-slate-800">{achievements.length}</span>
                    <span className="text-sm text-slate-500">Achievements</span>
                  </div>
                </ProgressRing>
              </div>
              
              <button 
                onClick={() => setIsFormVisible(!isFormVisible)}
                className="w-full px-5 py-3 rounded-lg bg-feelworthy-mint text-slate-800 font-medium 
                  flex items-center justify-center gap-2 shadow-md shadow-feelworthy-mint/20 
                  hover:shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <PlusCircle size={18} />
                <span>Add Achievement</span>
              </button>
            </FadeIn>
          </div>
          
          <div className="w-full md:w-2/3">
            {isFormVisible && (
              <FadeIn delay={0} duration={300} className="mb-8">
                <div className="bg-feelworthy-cream/50 p-6 rounded-xl border border-feelworthy-cream shadow-md">
                  <h3 className="text-xl font-medium mb-4 text-slate-800">Add New Achievement</h3>
                  <form onSubmit={handleAddAchievement}>
                    <textarea
                      value={newAchievement}
                      onChange={(e) => setNewAchievement(e.target.value)}
                      placeholder="What did you accomplish today?"
                      className="w-full p-4 rounded-lg border border-slate-200 focus:border-feelworthy-teal 
                        focus:ring-2 focus:ring-feelworthy-teal/20 outline-none transition-all mb-4 text-gray-800"
                      rows={3}
                    />
                    <div className="flex justify-end gap-3">
                      <button 
                        type="button" 
                        onClick={() => setIsFormVisible(false)}
                        className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 
                          hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-feelworthy-teal text-gray-800 font-medium 
                          shadow-md shadow-feelworthy-teal/20 hover:shadow-lg transition-all 
                          disabled:opacity-50 disabled:pointer-events-none"
                        disabled={!newAchievement.trim()}
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </FadeIn>
            )}
            
            <div className="space-y-4">
              {achievements.length === 0 ? (
                <FadeIn delay={300}>
                  <div className="bg-feelworthy-cream/30 rounded-xl p-8 text-center">
                    <Award size={48} className="mx-auto mb-4 text-slate-400" />
                    <h3 className="text-lg font-medium text-slate-600">No achievements yet</h3>
                    <p className="text-slate-500 mt-2">
                      Start recording your wins, no matter how small they may seem.
                    </p>
                  </div>
                </FadeIn>
              ) : (
                achievements.map((achievement, index) => (
                  <FadeIn key={achievement.id} delay={200 + index * 50} direction="left">
                    <div className="bg-white rounded-xl p-6 shadow-md border border-slate-100 
                      hover:shadow-lg transition-all hover:border-feelworthy-mint/30">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-lg text-slate-800">{achievement.text}</p>
                          <p className="text-sm text-slate-500 mt-2">
                            {new Date(achievement.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <button 
                          onClick={() => handleDeleteAchievement(achievement.id)}
                          className="text-slate-400 hover:text-rose-500 transition-colors"
                          aria-label="Delete achievement"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </FadeIn>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AchievementJournal;
