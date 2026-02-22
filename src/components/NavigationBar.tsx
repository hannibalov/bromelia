'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useI18n } from '../../locales/client';
import LanguageSwitcher from './LanguageSwitcher';

export default function NavigationBar() {
  const pathname = usePathname();
  const t = useI18n();
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we are on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle mouse movement for desktop hover reveal
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Reveal if mouse is in the top 60px
      if (e.clientY < 60) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  // Hide the navigation bar on the home page (considering locale prefix)
  const isHomePage = pathname === '/es' || pathname === '/en' || pathname === '/';
  if (isHomePage) {
    return null;
  }

  // On mobile, it's always visible but compact.
  // On desktop, it slides in/out based on visibility state.
  const visibilityClasses = isMobile 
    ? "translate-y-0" 
    : isVisible 
      ? "translate-y-0 opacity-100" 
      : "-translate-y-full opacity-0 pointer-events-none";

  return (
    <nav 
      className={`fixed top-0 left-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-green-100/50 transition-all duration-300 transform ${visibilityClasses}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <div className="flex items-center">
            <Link 
              href="/"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-green-50 transition-colors group"
              aria-label={t('nav.back')}
            >
              <span className="text-xl group-hover:-translate-x-1 transition-transform duration-200">←</span>
              <span className="font-bold text-green-800 hidden sm:block">{t('nav.back')}</span>
              <span className="font-bold text-green-800 sm:hidden">🏠</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
