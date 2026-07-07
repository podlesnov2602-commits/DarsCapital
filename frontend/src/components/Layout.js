import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Phone, Mail } from 'lucide-react';
import { Button } from './ui/button';

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { title: 'Главная', path: '/' },
    { title: 'Апартаменты', path: '/apartments' },
    { title: 'Виллы', path: '/villas' },
    { title: 'Коммерция', path: '/commerce' },
    { title: 'О нас', path: '/about' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md shadow-[0_8px_30px_rgba(15,31,58,0.28)] py-3 md:py-4 text-white transition-all duration-300"
      >
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center gap-3 min-h-14 md:min-h-0">
          {/* Logo */}
          <Link to="/" className="flex flex-col items-start md:items-center group max-w-[75%] md:max-w-none">
            <div className="text-lg sm:text-2xl font-serif font-bold tracking-[0.08em] sm:tracking-widest flex items-center leading-none">
              <span className="text-white">DARS</span>
              <span className="ml-2 text-[#6FA8FF]">CAPITAL</span>
            </div>
            <div className="hidden sm:block text-[10px] tracking-[0.2em] uppercase mt-1 opacity-80 text-white">
              Premium Real Estate
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm uppercase tracking-wider font-medium hover:text-accentblue transition-colors ${
                  location.pathname === link.path
                    ? 'text-accentblue'
                    : 'text-white/90'
                }`}
              >
                {link.title}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2.5 shrink-0 rounded-md border border-white/40 text-white hover:bg-accentblue/20 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div
          className={`absolute top-full left-0 right-0 bg-primary shadow-lg transition-all duration-300 overflow-hidden md:hidden ${
            isMenuOpen ? 'max-h-[calc(100vh-72px)] border-t border-white/10 overflow-y-auto' : 'max-h-0'
          }`}
        >
          <nav className="flex flex-col p-4 pb-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`py-4 text-center text-sm uppercase tracking-wider border-b border-white/10 ${
                  location.pathname === link.path ? 'text-accentblue font-bold' : 'text-white'
                }`}
              >
                {link.title}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col pt-0">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-primary text-[#E5E7EB] pt-20 pb-10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div className="flex flex-col items-start">
              <div className="text-3xl font-serif font-bold tracking-widest flex items-center mb-2">
                <span>DARS</span>
                <span className="ml-2 text-[#6FA8FF]">CAPITAL</span>
              </div>
              <p className="text-sm text-[#D1D5DB] mt-4 max-w-xs">
                Эксклюзивные объекты для тех, кто выбирает уровень. Закрытый клуб элитной недвижимости Алматы.
              </p>
            </div>

            <div>
              <h4 className="font-serif text-xl mb-6 text-accentblue">Навигация</h4>
              <ul className="space-y-3">
                {navLinks.map(link => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-[#E5E7EB]/80 hover:text-accentblue transition-colors">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-xl mb-6 text-accentblue">Контакты</h4>
              <ul className="space-y-4 text-[#D1D5DB]">
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-accentblue" />
                  <a href="tel:+77077157249" className="hover:text-accentblue transition-colors">+7 707 715 72 49</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-accentblue" />
                  <a href="mailto:darscapital@gmail.com" className="hover:text-accentblue transition-colors">darscapital@gmail.com</a>
                </li>
                <li className="flex gap-4 mt-6">
                  <a href="https://www.instagram.com/d.darsil" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accentblue hover:text-white transition-all">
                    <Instagram size={20} />
                  </a>
                  <a href="https://wa.me/77077157249" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accentblue hover:text-white transition-all">
                    <Phone size={20} />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/15 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-[#E5E7EB]/60 gap-2">
            <p>&copy; {new Date().getFullYear()} DARS CAPITAL. Все права защищены.</p>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <p>Premium Real Estate Agency</p>
              <Link to="/privacy-policy" className="underline hover:text-accentblue transition-colors">
                Политика конфиденциальности
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/77077157249"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_12px_30px_rgba(37,211,102,0.35)] hover:scale-110 hover:shadow-[0_16px_34px_rgba(37,211,102,0.45)] transition-all duration-300"
        aria-label="Написать в WhatsApp"
      >
        <svg viewBox="0 0 32 32" className="w-8 h-8">
          <path fill="currentColor" d="M16 0c-8.837 0-16 7.163-16 16 0 2.825 0.737 5.607 2.137 8.048l-2.137 7.952 7.933-2.127c2.42 1.37 5.173 2.127 8.067 2.127 8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 29.467c-2.482 0-4.908-0.646-7.07-1.87l-0.507-0.292-4.713 1.262 1.262-4.669-0.292-0.508c-1.207-2.100-1.847-4.507-1.847-6.924 0-7.435 6.065-13.5 13.5-13.5s13.5 6.065 13.5 13.5-6.065 13.5-13.5 13.5zM21.82 19.138c-0.397-0.199-2.354-1.161-2.719-1.294-0.365-0.132-0.63-0.199-0.895 0.199s-1.028 1.294-1.261 1.56c-0.232 0.265-0.464 0.298-0.861 0.099s-1.68-0.619-3.199-1.973c-1.182-1.054-1.98-2.357-2.212-2.754s-0.025-0.611 0.174-0.809c0.179-0.176 0.397-0.463 0.596-0.694s0.265-0.397 0.397-0.662c0.132-0.265 0.066-0.496-0.033-0.694s-0.895-2.154-1.227-2.949c-0.323-0.774-0.651-0.67-0.895-0.682-0.232-0.012-0.496-0.015-0.761-0.015s-0.694 0.099-1.059 0.496c-0.365 0.397-1.394 1.361-1.394 3.319s1.427 3.849 1.626 4.114c0.199 0.265 2.807 4.281 6.8 6.004 0.95 0.411 1.691 0.655 2.27 0.839 0.955 0.303 1.824 0.26 2.513 0.157 0.767-0.115 2.354-0.962 2.686-1.891s0.332-1.726 0.232-1.891c-0.099-0.166-0.364-0.265-0.761-0.464z"/>
        </svg>
      </a>
    </div>
  );
};

export default Layout;
