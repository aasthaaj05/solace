import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Lottie from "lottie-react";
import avatarAnimation from "../../assets/avatar.json";

const AvatarAssistant = () => {
  const location = useLocation();
  const [voiceReady, setVoiceReady] = useState(false);
  const [message, setMessage] = useState('');
  const [canSpeak, setCanSpeak] = useState(false); // Triggered by user interaction

  // Set message based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setMessage('Welcome to Solace, How may i help you!');
    } else if (path === '/student-dashboard') {
      setMessage('Happiness depends upon ourselves. take the time today to love yourself. ');
    } else if (path === '/exam-harmony') {
      setMessage('Welcome to Exam Harmony — your peaceful space to prepare and perform your best.');
    } else if (path === '/curated') {
      setMessage('This is your Curated Space — a collection tailored just for your growth and inspiration');
    } else if (path === '/journal') {
      setMessage('Welcome to your Gratitude Journal — take a moment to reflect on the positives today.');
    } else if (path === '/let-it-out') {
      setMessage('This is your safe zone — Let It Out is all about expressing freely and feeling lighter');
    } else if (path === '/gratitude-wall') {
      setMessage('This is the Gratitude Wall — a place to celebrate little joys and shared thankfulness');
    } else if (path === '/feel-worthy') {
      setMessage('Welcome to FeelWorthy — remember, you matter and you are enough.');
    } else if (path === '/spinner') {
      setMessage('Time for a surprise! Spin the Wheel and explore something refreshing.');
    } else if (path === '/crisis') {
      setMessage('Here’s Your Perspective — share your thoughts or see life through someone else’s lens.');
    } else if (path === '/guided-meditations') {
      setMessage('Let’s relax together — welcome to Guided Meditation. Breathe in… and out…');
    } else if (path === '/community-chat') {
      setMessage('You’re not alone. Community Support is here to uplift and walk with you');
    } else if (path === '/contact-counsellor') {
      setMessage('Need a hand? Explore Professional Resources tailored to help you with care and confidentiality.');
    }
     else {
      setMessage('You have navigated to a new page.');
    }
  }, [location]);

  // Load available voices
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

  // Enable speech after first user click
  useEffect(() => {
    const handleClick = () => {
      setCanSpeak(true);
      window.removeEventListener('click', handleClick); // Only trigger once
    };
    window.addEventListener('click', handleClick);

    return () => window.removeEventListener('click', handleClick);
  }, []);

  // Speak message
  useEffect(() => {
    if (!voiceReady || !message || !canSpeak) return;

    const synth = window.speechSynthesis;
    synth.cancel(); // Cancel any existing speech

    const utterance = new SpeechSynthesisUtterance(message);
    const voices = synth.getVoices();
    const selectedVoice = voices.find(v => v.lang === 'en-GB' || v.name.includes('Male'));
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.pitch = 1;
    utterance.rate = 1;

    synth.speak(utterance);
  }, [message, voiceReady, canSpeak]);

  return (
    <div style={styles.avatarBox}>
      <Lottie animationData={avatarAnimation} style={styles.lottie} loop />
    </div>
  );
};

const styles = {
  avatarBox: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "250px",
    zIndex: 9999,
  },
};

export default AvatarAssistant;
