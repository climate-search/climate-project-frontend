import { useState, useEffect } from 'react'
import { ProjectProvider } from './context/ProjectContext'
import { Navigation } from './components/Navigation'
import { ProjectList } from './components/ProjectList'
import { ProjectForm } from './components/ProjectForm'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('search')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    console.log('%c🚀 Climate Project Frontend Started', 'color: green; font-size: 16px; font-weight: bold;')
    console.log('%cAPI Base URL: ' + (import.meta.env.VITE_API_URL || 'http://localhost:8080'), 'color: blue; font-size: 12px;')
    console.log('%cDevelopment Mode: ' + (import.meta.env.DEV ? 'Yes' : 'No'), 'color: orange; font-size: 12px;')
    console.log('%cOpen browser DevTools (F12) to see detailed API logs', 'color: purple; font-size: 12px;')
  }, [])

  const handleProjectAdded = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <ProjectProvider>
      <div className="app">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="main-content">
          {activeTab === 'search' && <ProjectList key={refreshKey} />}
          {activeTab === 'register' && <ProjectForm onProjectAdded={handleProjectAdded} />}
        </main>

        <footer className="app-footer">
          <p>© 2025 기후 프로젝트 통합 검색 | 지구 환경 보호를 위한 프로젝트 정보 공유</p>
        </footer>
      </div>
    </ProjectProvider>
  )
}

export default App
