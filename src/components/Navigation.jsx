import './Navigation.css'

export const Navigation = ({ activeTab, onTabChange }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>🌍 기후 프로젝트 통합 검색</h1>
        </div>
        <ul className="navbar-menu">
          <li>
            <button
              className={`nav-link ${activeTab === 'search' ? 'active' : ''}`}
              onClick={() => onTabChange('search')}
            >
              🔍 프로젝트 검색
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => onTabChange('register')}
            >
              ➕ 프로젝트 등록
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
