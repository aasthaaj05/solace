import React, { useEffect, useRef, useState } from 'react';

const FadeIn = ({ 
  children, 
  delay = 0, 
  duration = 500, 
  className = "", 
  direction = "up",
  distance = 20
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    });
    
    const { current } = domRef;
    observer.observe(current);
    
    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [delay]);
  
  // Define transform based on direction
  const getTransform = () => {
    switch (direction) {
      case "up":
        return `translateY(${distance}px)`;
      case "down":
        return `translateY(-${distance}px)`;
      case "left":
        return `translateX(${distance}px)`;
      case "right":
        return `translateX(-${distance}px)`;
      default:
        return `translateY(${distance}px)`;
    }
  };

  const animationStyle = {
    transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translate(0, 0)' : getTransform()
  };

  return (
    <div
      ref={domRef}
      style={animationStyle}
      className={className}
    >
      {children}
    </div>
  );
};

export default FadeIn;
