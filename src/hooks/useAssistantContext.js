import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAssistant } from '../context/AssistantContext';

const TOPIC_NAMES = {
  Motion_9: 'Motion (Class 9 Physics)',
  Laws_of_Motion_9: 'Laws of Motion (Class 9 Physics)',
  Gravitation_9: 'Gravitation (Class 9 Physics)',
  Matter_9: 'Matter in Our Surroundings (Class 9 Chemistry)',
  Atoms_Molecules_9: 'Atoms and Molecules (Class 9 Chemistry)',
  Structure_Atoms_9: 'Structure of Atoms (Class 9 Chemistry)',
  Cells_9: 'Fundamental Unit of Life — Cells (Class 9 Biology)',
  Tissues_9: 'Tissues (Class 9 Biology)',
  Light_10: 'Light Reflection and Refraction (Class 10 Physics)',
  Human_Eye_10: 'Human Eye and Colourful World (Class 10 Physics)',
  Acids_10: 'Acids Bases and Salts (Class 10 Chemistry)',
  Carbon_10: 'Carbon and Its Compounds (Class 10 Chemistry)',
  Life_Processes_10: 'Life Processes (Class 10 Biology)',
  Control_10: 'Control and Coordination (Class 10 Biology)'
};

const PAGE_NAMES = {
  '/dashboard': 'Dashboard',
  '/progress': 'Progress',
  '/login': 'Login',
  '/register': 'Register',
  '/forgot-password': 'Forgot Password'
};

export function useAssistantContext() {
  const { setCurrentTopic, setCurrentPage } = useAssistant();
  const location = useLocation();
  
  let topicId = null;
  const match = location.pathname.match(/\/topic\/([^/]+)/);
  if (match) topicId = match[1];

  useEffect(() => {
    if (topicId && TOPIC_NAMES[topicId]) {
      setCurrentTopic(TOPIC_NAMES[topicId]);
    } else {
      setCurrentTopic(null);
    }

    const pageName = PAGE_NAMES[location.pathname];
    if (pageName) {
      setCurrentPage(pageName);
    } else if (location.pathname.includes('/theory')) {
      setCurrentPage('Theory');
    } else if (location.pathname.includes('/quiz')) {
      setCurrentPage('Quiz');
    } else if (location.pathname.includes('/simulation')) {
      setCurrentPage('Simulation');
    } else {
      setCurrentPage(null);
    }
  }, [location.pathname, topicId, setCurrentTopic, setCurrentPage]);
}
