import React, { useState, useEffect } from 'react';
import { Clock, BookOpen, CheckSquare, FileText, BarChart2, Menu, X } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Navigation items
  const navItems = [
    { id: 'timer', label: 'Timer', icon: <Clock size={20} /> },
    { id: 'subjects', label: 'Subjects', icon: <BookOpen size={20} /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
    { id: 'notes', label: 'Notes', icon: <FileText size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={20} /> },
  ];

  return (
    <header className={`sticky top-0 z-10 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-md'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Clock className="text-indigo-600 mr-2" size={24} />
            <h1 className="text-xl font-bold text-slate-800">Study Companion+</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-slate-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-700 hover:text-indigo-600 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200 animate-fadeIn">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center w-full px-4 py-3 text-left ${
                activeTab === item.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-gray-50'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;