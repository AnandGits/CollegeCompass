import { Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Applications from './pages/Applications'
import SavedColleges from './pages/SavedColleges'
import Essays from './pages/Essays'
import Deadlines from './pages/Deadlines'
import Tasks from './pages/Tasks'
import Advisor from './pages/Advisor'
import Recommendations from './pages/Recommendations'
import Majors from './pages/Majors'
import Wiki from './pages/Wiki'
import Holland from './pages/Holland'
import Faq from './pages/Faq'
import AskMeAnything from './pages/AskMeAnything'
import Search from './pages/Search'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import About from './pages/About'
import BragSheet from './pages/BragSheet'

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/saved" element={<SavedColleges />} />
        <Route path="/essays" element={<Essays />} />
        <Route path="/deadlines" element={<Deadlines />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/advisor" element={<Advisor />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/majors" element={<Majors />} />
        <Route path="/wiki" element={<Wiki />} />
        <Route path="/holland" element={<Holland />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/ama" element={<AskMeAnything />} />
        <Route path="/search" element={<Search />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/about" element={<About />} />
        <Route path="/brag-sheet" element={<BragSheet />} />
      </Routes>
    </AppShell>
  )
}

export default App
