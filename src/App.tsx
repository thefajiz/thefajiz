import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './routes/index'
import About from './routes/about'
import Work from './routes/work'
import Contact from './routes/contact'
import Arcade from './routes/arcade'
import Resume from './routes/resume'
import Privacy from './routes/privacy'
import Terms from './routes/terms'
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
        <Route path="/arcade" element={<Arcade />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        {/* Fallback for 404 */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  )
}
