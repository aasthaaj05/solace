import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Lottie from "lottie-react";
import avatarAnimation from "../../assets/avatar.json";
import { px } from 'framer-motion';

const AvatarAssistant = () => {
  const location = useLocation();
  const [voiceReady, setVoiceReady] = useState(false);
  const [message, setMessage] = useState('');
  const [canSpeak, setCanSpeak] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);

  useEffect(() => {
    const path = location.pathname;
    const messages = {
      '/': 'Welcome to Solace, How may I help you!',
      '/student-dashboard': 'Happiness depends upon ourselves. Take the time today to love yourself.',
      '/exam-harmony': 'Welcome to Exam Harmony — your peaceful space to prepare and perform your best.',
      '/curated': 'This is your Curated Space — a collection tailored just for your growth and inspiration.',
      '/journal': 'Welcome to your Gratitude Journal — take a moment to reflect on the positives today.',
      '/let-it-out': 'This is your safe zone — Let It Out is all about expressing freely and feeling lighter.',
      '/gratitude-wall': 'This is the Gratitude Wall — a place to celebrate little joys and shared thankfulness.',
      '/feel-worthy': 'Welcome to FeelWorthy — remember, you matter and you are enough.',
      '/spinner': 'Time for a surprise! Spin the Wheel and explore something refreshing.',
      '/crisis': 'Here’s Your Perspective — share your thoughts or see life through someone else’s lens.',
      '/guided-meditations': 'Let’s relax together — welcome to Guided Meditation. Breathe in… and out…',
      '/community-chat': 'You’re not alone. Community Support is here to uplift and walk with you.',
      '/contact-counsellor': 'Need a hand? Explore Professional Resources tailored to help you with care and confidentiality.'
    };

    setMessage(messages[path] || 'You have navigated to a new page.');
  }, [location]);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const loadVoices = () => {
      if (synth.getVoices().length > 0) {
        setVoiceReady(true);
      }
    };
    loadVoices();
    synth.onvoiceschanged = loadVoices;

    return () => {
      synth.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    const handleClick = () => {
      setCanSpeak(true);
      window.removeEventListener('click', handleClick);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    if (!voiceReady || !message || !canSpeak || !voiceOn) return;

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(message);
    const voices = synth.getVoices();
    const selectedVoice = voices.find(v => v.lang === 'en-IN' || v.name.includes('Male'));
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.pitch = 1;
    utterance.rate = 1;

    synth.speak(utterance);
  }, [message, voiceReady, canSpeak, voiceOn]);

  return (
    <div style={styles.avatarContainer}>
      <Lottie animationData={avatarAnimation} style={styles.lottie} loop />
      <div style={styles.toggleContainer}>
        <label style={styles.label}>
          <input
            type="checkbox"
            checked={voiceOn}
            onChange={() => setVoiceOn(!voiceOn)}
            style={styles.checkbox}
          />
          <span>{voiceOn ? 'Voice On 🔊' : 'Voice Off 🔇'}</span>
        </label>
      </div>
    </div>
  );
};

const styles = {
  avatarContainer: {
    position: "fixed",
    bottom: "20px",
    left: "5px",
    width: "150px",
    maxWidth: "40vw", // adjusts width relative to screen size
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "8px",
  },
  lottie: {
    width: "100%",
    height: "auto",
  },
  toggleContainer: {
    marginTop: "8px",
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  label: {
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    color: "#222",
    flexWrap: "wrap", // handles narrow screens
    textAlign: "center",
  },
  checkbox: {
    transform: "scale(1.1)",
    cursor: "pointer",
    margin: "0px",
    
  }
};


export default AvatarAssistant;
