import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Stats from './components/Stats';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Blog from './components/Blog';
import Chatbot from './components/Chatbot';
import AdminDashboard from './components/AdminDashboard';
import DebugSupabase from './components/DebugSupabase';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white decorative-lines">
        <Routes>
          {/* Page principale */}
          <Route path="/" element={
            <>
              <Header />
              <Hero />
              <Stats />
              <Services />
              <About />
              <Testimonials />
              <Blog />
              <Contact />
              <Footer />
              <Chatbot />
            </>
          } />
          
          {/* Dashboard admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Page de debug Supabase */}
          <Route path="/debug" element={<DebugSupabase />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;