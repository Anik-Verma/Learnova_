import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Dashboard from './pages/Dashboard';
import TheoryPage from './pages/TheoryPage';
import QuizPage from './pages/QuizPage';
import ProgressPage from './pages/ProgressPage';
import SimulationPage from './pages/SimulationPage';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useTheme } from './context/ThemeContext';
import { getTheme } from './utils/theme';
import { useAssistantContext } from './hooks/useAssistantContext';
import AIAssistant from './components/assistant/AIAssistant';
import { getStudent, saveStudent, migrateUserData, loadProgressFromSupabase } from './utils/storage';

function AppContent() {
  useAssistantContext();
  const navigate = useNavigate();

  useEffect(() => {
    const syncProgress = async () => {
      const cloudProgress = await loadProgressFromSupabase()
      if (cloudProgress) {
        console.log('Progress synced from Supabase')
      }
    }
    syncProgress()
  }, [])

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'learnova_users') {
        const student = getStudent();
        if (student) {
          const users = JSON.parse(e.newValue || '[]');
          const fresh = users.find(u => u.email.toLowerCase() === student.email?.toLowerCase());
          if (fresh) {
            saveStudent(fresh);
          }
        }
      }
      
      if (e.key === 'learnova_student' && !e.newValue) {
        navigate('/login');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);
  
  return (
    <>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/topic/:topicId/theory" element={
            <ProtectedRoute><TheoryPage /></ProtectedRoute>
          } />
          <Route path="/topic/:topicId/quiz" element={
            <ProtectedRoute><QuizPage /></ProtectedRoute>
          } />
          <Route path="/progress" element={
            <ProtectedRoute><ProgressPage /></ProtectedRoute>
          } />
          {/* Placeholder for simulations */}
          <Route path="/topic/:topicId/simulation" element={
            <ProtectedRoute>
              <SimulationPage />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      <AIAssistant />
    </>
  );
}

function App() {
  const { isDark } = useTheme();
  const t = getTheme(isDark);

  useEffect(() => {
    // Fix any old format data on startup
    migrateUserData();
  }, []);

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
