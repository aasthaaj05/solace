import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// Sample quotes for the Quote of the Day
const quotes = [
  "The best way to predict the future is to create it. - Peter Drucker",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
  "You are never too old to set another goal or to dream a new dream. - C.S. Lewis",
  "The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt",
  "Do what you can, with what you have, where you are. - Theodore Roosevelt",
  "It always seems impossible until it's done. - Nelson Mandela",
  "Act as if what you do makes a difference. It does. - William James",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "You miss 100% of the shots you don't take. - Wayne Gretzky",
];

// FAQs data
const faqsData = [
  {
    question: "How do I get started with Solace?",
    answer: "Getting started is easy! Simply click on the 'Sign Up' button and choose whether you're a student or a counsellor. Fill in your details, verify your email, and you'll be ready to explore our platform and resources."
  },
  {
    question: "Is my information kept confidential?",
    answer: "Absolutely. At Solace, we take privacy very seriously. All your personal information and conversations are encrypted and kept strictly confidential. We adhere to the highest standards of data protection and privacy regulations."
  },
  {
    question: "How can I connect with a counsellor?",
    answer: "After signing up as a student, you can browse through our verified counsellors' profiles and request an appointment. Alternatively, you can use our matching system that pairs you with counsellors based on your specific needs and preferences."
  },
  {
    question: "What resources are available for free?",
    answer: "We offer a range of free resources including basic meditation guides, articles on mental health topics, community forums, and self-assessment tools. Premium features include one-on-one counselling sessions, specialized workshops, and advanced courses."
  },
  {
    question: "Can I use Solace during a mental health crisis?",
    answer: "While Solace provides valuable support resources, it is not designed for crisis intervention. If you're experiencing a mental health emergency, please contact your local emergency services, crisis hotline, or go to your nearest emergency room immediately."
  },
  {
    question: "How can I become a counsellor on Solace?",
    answer: "To join as a counsellor, you'll need to sign up and submit your professional credentials, including your qualifications, license information, and relevant experience. Our team will review your application and guide you through the verification process."
  },
];

// Function to get a random quote
const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};

const Home = () => {
  const [quoteOfTheDay, setQuoteOfTheDay] = useState(getRandomQuote());
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(null);
  
  // Refs for scroll targets
  const servicesRef = useRef(null);
  const testimonialsRef = useRef(null);
  const faqsRef = useRef(null);
  const contactRef = useRef(null); // New ref for Contact Us section

  // Function to handle smooth scrolling
  const scrollToSection = (elementRef) => {
    window.scrollTo({
      top: elementRef.current.offsetTop - 80, // Offset for navbar
      behavior: 'smooth'
    });
    setIsNavOpen(false); // Close mobile menu after clicking
  };

  // Update the quote every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteOfTheDay(getRandomQuote());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Toggle FAQ accordion
  const toggleFaq = (index) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f9d2] to-[#a6f1e0]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white bg-opacity-80 backdrop-blur-md shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-[#73C7C7]">Solace</span>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsNavOpen(!isNavOpen)}
                className="text-gray-600 hover:text-[#73C7C7] focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isNavOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              <button 
                onClick={() => scrollToSection(servicesRef)}
                className="text-gray-700 hover:text-[#73C7C7] font-medium transition-colors duration-300"
              >
                Services
              </button>
              <Link to="/about" className="text-gray-700 hover:text-[#73C7C7] font-medium transition-colors duration-300">
                About Us
              </Link>
              <button 
                onClick={() => scrollToSection(faqsRef)}
                className="text-gray-700 hover:text-[#73C7C7] font-medium transition-colors duration-300"
              >
                FAQs
              </button>
              <button 
                onClick={() => scrollToSection(testimonialsRef)}
                className="text-gray-700 hover:text-[#73C7C7] font-medium transition-colors duration-300"
              >
                Testimonials
              </button>
              <button 
                onClick={() => scrollToSection(contactRef)}
                className="text-gray-700 hover:text-[#73C7C7] font-medium transition-colors duration-300"
              >
                Contact Us
              </button>
              <Link 
                to="/login" 
                className="ml-4 px-4 py-2 rounded-lg bg-[#73C7C7] text-white font-medium hover:bg-[#5dbbb3] transition-colors duration-300"
              >
                Login
              </Link>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {isNavOpen && (
            <div className="md:hidden py-2 space-y-2">
              <button 
                onClick={() => scrollToSection(servicesRef)} 
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[#73C7C7]"
              >
                Services
              </button>
              <Link to="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[#73C7C7]">
                About Us
              </Link>
              <button 
                onClick={() => scrollToSection(faqsRef)} 
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[#73C7C7]"
              >
                FAQs
              </button>
              <button 
                onClick={() => scrollToSection(testimonialsRef)} 
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[#73C7C7]"
              >
                Testimonials
              </button>
              <button 
                onClick={() => scrollToSection(contactRef)} 
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[#73C7C7]"
              >
                Contact Us
              </button>
              <Link to="/login" className="block px-4 py-2 text-white bg-[#73C7C7] rounded-lg hover:bg-[#5dbbb3]">
                Login
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="w-full py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#73C7C7] mb-6">Find Your Inner Peace with Solace</h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            A supportive platform dedicated to improving mental health and wellbeing for students and counsellors alike.
          </p>
          
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/signup/student"
              className="px-6 py-3 bg-[#5cb85c] text-white font-medium rounded-lg hover:bg-[#4da44d] transition-colors duration-300"
            >
              Sign Up as Student
            </Link>
            <Link
              to="/signup/counsellor"
              className="px-6 py-3 bg-[#428bca] text-white font-medium rounded-lg hover:bg-[#357ebd] transition-colors duration-300"
            >
              Sign Up as Counsellor
            </Link>
          </div>
        </div>
      </div>

      {/* Quote of the Day Section */}
      <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center mb-16">
        <div className="max-w-2xl w-full bg-white bg-opacity-90 backdrop-blur-lg p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <h2 className="text-2xl font-bold text-[#4fa3a3] mb-4">Quote of the Day</h2>
          <p className="text-lg text-gray-700 italic">{quoteOfTheDay}</p>
        </div>
      </div>

      {/* Features Grid */}
      <div ref={servicesRef} className="w-full px-4 sm:px-6 lg:px-8 pb-16 pt-8">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-[#73C7C7] mb-2">Our Services</h2>
          <p className="text-gray-600">Supporting your mental wellbeing journey with comprehensive resources</p>
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mental Health Support */}
          <div className="bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-xl shadow-md transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="w-12 h-12 bg-[#73C7C7] bg-opacity-20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#73C7C7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#73C7C7] mb-2">Mental Health Support</h2>
            <p className="text-gray-600 mb-4">
              Access personalized resources, guided sessions, and connect with professionals to support your mental wellbeing journey.
            </p>
            <Link to="/services" className="text-[#73C7C7] font-medium hover:text-[#5dbbb3]">
              Learn More →
            </Link>
          </div>

          {/* Community Connection */}
          <div className="bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-xl shadow-md transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="w-12 h-12 bg-[#73C7C7] bg-opacity-20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#73C7C7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#73C7C7] mb-2">Community Connection</h2>
            <p className="text-gray-600 mb-4">
              Join a supportive community where you can share experiences, participate in group activities, and build meaningful connections.
            </p>
            <Link to="/community" className="text-[#73C7C7] font-medium hover:text-[#5dbbb3]">
              Join Now →
            </Link>
          </div>

          {/* Expert Resources */}
          <div className="bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-xl shadow-md transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="w-12 h-12 bg-[#73C7C7] bg-opacity-20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#73C7C7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#73C7C7] mb-2">Expert Resources</h2>
            <p className="text-gray-600 mb-4">
              Access our library of professionally curated articles, videos, and exercises designed to support your mental health journey.
            </p>
            <Link to="/resources" className="text-[#73C7C7] font-medium hover:text-[#5dbbb3]">
              Explore Resources →
            </Link>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div ref={faqsRef} className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-white bg-opacity-60">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-[#73C7C7] mb-2">Frequently Asked Questions</h2>
          <p className="text-gray-600">Find answers to common questions about Solace</p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {faqsData.map((faq, index) => (
            <div 
              key={index} 
              className="mb-4 bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button 
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleFaq(index)}
              >
                <span className="font-medium text-gray-800">{faq.question}</span>
                <svg 
                  className={`w-5 h-5 text-[#73C7C7] transform ${expandedFaqIndex === index ? 'rotate-180' : ''} transition-transform duration-200`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ${expandedFaqIndex === index ? 'max-h-96 pb-4' : 'max-h-0'}`}
              >
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link 
            to="/faqs" 
            className="inline-flex items-center text-[#73C7C7] font-medium hover:text-[#5dbbb3]"
          >
            View All FAQs
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Testimonials Section */}
      <div ref={testimonialsRef} className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-white bg-opacity-50">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-[#73C7C7] mb-2">What Our Users Say</h2>
          <p className="text-gray-600">Hear from students and counsellors who have found value in our platform</p>
        </div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-[#f3f9d2] rounded-full flex items-center justify-center mr-4">
                <span className="text-xl font-bold text-[#73C7C7]">S</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Sarah K.</h3>
                <p className="text-sm text-gray-500">Student</p>
              </div>
            </div>
            <p className="text-gray-600">
              "Solace helped me through a really difficult semester. The resources and support I found here made all the difference."
            </p>
          </div>
          
          {/* Testimonial 2 */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-[#f3f9d2] rounded-full flex items-center justify-center mr-4">
                <span className="text-xl font-bold text-[#73C7C7]">M</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Michael T.</h3>
                <p className="text-sm text-gray-500">Counsellor</p>
              </div>
            </div>
            <p className="text-gray-600">
              "As a counsellor, Solace provides me with great tools to better support my students and connect with them in meaningful ways."
            </p>
          </div>
          
          {/* Testimonial 3 */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-[#f3f9d2] rounded-full flex items-center justify-center mr-4">
                <span className="text-xl font-bold text-[#73C7C7]">A</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Aisha N.</h3>
                <p className="text-sm text-gray-500">Student</p>
              </div>
            </div>
            <p className="text-gray-600">
              "The meditation resources and community support have become an essential part of my daily routine. My anxiety has decreased significantly."
            </p>
          </div>
        </div>
      </div>

      {/* Contact Us Section */}
      <div ref={contactRef} className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-white bg-opacity-60">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-[#73C7C7] mb-2">Contact Us</h2>
          <p className="text-gray-600">We're here to help! Reach out to us for any questions or support.</p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#73C7C7] focus:border-[#73C7C7]"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#73C7C7] focus:border-[#73C7C7]"
                placeholder="Your Email"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#73C7C7] focus:border-[#73C7C7]"
                placeholder="Your Message"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-[#73C7C7] text-white font-medium rounded-lg hover:bg-[#5dbbb3] transition-colors duration-300"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Call to Action */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center bg-gradient-to-r from-[#73C7C7] to-[#5dbbb3] text-white">
        <h2 className="text-3xl font-bold mb-4 text-center">Ready to Begin Your Journey?</h2>
        <p className="text-lg mb-8 max-w-2xl text-center">
          Join our community today and take the first step towards better mental wellbeing.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/signup"
            className="px-6 py-3 bg-white text-[#73C7C7] font-medium rounded-lg hover:bg-gray-100 transition-colors duration-300"
          >
            Sign Up Now
          </Link>
          <Link
            to="/about"
            className="px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-[#73C7C7] transition-colors duration-300"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-white bg-opacity-90 py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-[#73C7C7] mb-4">Solace</h3>
            <p className="text-gray-600">
              Creating a supportive environment for mental wellbeing.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-[#73C7C7]">About Us</Link></li>
              <li><button onClick={() => scrollToSection(servicesRef)} className="text-gray-600 hover:text-[#73C7C7]">Services</button></li>
              <li><button onClick={() => scrollToSection(faqsRef)} className="text-gray-600 hover:text-[#73C7C7]">FAQs</button></li>
              <li><button onClick={() => scrollToSection(contactRef)} className="text-gray-600 hover:text-[#73C7C7]">Contact Us</button></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/meditations" className="text-gray-600 hover:text-[#73C7C7]">Meditations</Link></li>
              <li><Link to="/articles" className="text-gray-600 hover:text-[#73C7C7]">Articles</Link></li>
              <li><Link to="/community" className="text-gray-600 hover:text-[#73C7C7]">Community</Link></li>
              <li><Link to="/events" className="text-gray-600 hover:text-[#73C7C7]">Events</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              
              
              
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;