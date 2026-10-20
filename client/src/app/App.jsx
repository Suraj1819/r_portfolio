import { Routes, Route } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';
import Home from '../pages/Home';
import About from '../pages/About';
import Skills from '../pages/Skills';
import Projects from '../pages/Projects';
import ProjectDetail from '../pages/ProjectDetail';
import Experience from '../pages/Experience';
import Achievements from '../pages/Achievements';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="skills" element={<Skills />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:slug" element={<ProjectDetail />} />
        <Route path="experience" element={<Experience />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
