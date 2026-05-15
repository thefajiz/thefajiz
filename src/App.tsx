import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './routes/index'
import About from './routes/about'
import Work from './routes/work'
import Contact from './routes/contact'
import Try from './routes/try'
import Resume from './routes/resume'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/work" element={<Work />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/try" element={<Try />} />
        <Route path="/resume" element={<Resume />} />
        {/* Fallback for 404 */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  )
}
