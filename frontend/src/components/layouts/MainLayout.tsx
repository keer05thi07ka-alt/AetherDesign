import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../common/Navbar';
import { Sidebar } from '../common/Sidebar';
import { Footer } from '../common/Footer';
import { SupportChat } from '../common/SupportChat';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();

  const isWorkspace =
    location.pathname.startsWith('/business') ||
    location.pathname.startsWith('/creator') ||
    location.pathname === '/settings';

  const isAuthOrRole =
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/role-selection';

  const isFullEditor = location.pathname === '/creator/editor';

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex flex-col font-sans selection:bg-[#C4B5FD] selection:text-[#2D1B69]">
      
      {/* Hide standard navbar inside full screen Canva Editor */}
      {!isFullEditor && <Navbar />}

      {isWorkspace && !isFullEditor ? (
        <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
          <Sidebar />
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      ) : (
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      )}

      {/* Show Footer only on public pages and non-editor pages */}
      {!isWorkspace && !isAuthOrRole && <Footer />}

      {/* Support assistant. Hidden on auth pages, where there is no session
          to give it context, and in the editor, where it would sit over the
          canvas controls. */}
      {!isAuthOrRole && !isFullEditor && <SupportChat />}
    </div>
  );
};
