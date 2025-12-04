import { useState, useEffect } from 'react'
import { useProjects } from '../hooks/useProjects'
import { ProjectCard } from './ProjectCard'
import './ProjectList.css'

export const ProjectList = () => {
  const {
    projects,
    loading,
    error,
    currentPage,
    totalPages,
    getCategories,
    searchProjects,
    goToPage,
  } = useProjects()
  const [filters, setFilters] = useState({
    search: '',
    category: '',
  })

  const categories = getCategories()

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleReset = async () => {
    setFilters({
      search: '',
      category: '',
    })
    // Fetch all projects again (no filters)
    await searchProjects({})
  }

  // Apply filters when search or category changes
  useEffect(() => {
    const apiFilters = {}
    if (filters.search) {
      apiFilters.search = filters.search
    }
    if (filters.category) {
      apiFilters.category = filters.category
    }

    console.log('[ProjectList] Applying filters:', apiFilters)
    searchProjects(apiFilters)
  }, [filters.search, filters.category, searchProjects])

  // No local filtering - all done by API
  const filteredProjects = projects

  const handlePageChange = async (newPage) => {
    const apiFilters = {}
    if (filters.search) {
      apiFilters.search = filters.search
    }
    if (filters.category) {
      apiFilters.category = filters.category
    }
    console.log('[ProjectList] Page change with filters:', apiFilters)
    await goToPage(newPage, apiFilters)
  }

  const generatePageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1)

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  return (
    <div className="project-list-container">
      <div className="filters-section">
        <h2>프로젝트 검색</h2>
        <div className="filters-grid">
          <div className="filter-group">
            <label htmlFor="search">검색어</label>
            <input
              id="search"
              type="text"
              name="search"
              placeholder="프로젝트명, 설명으로 검색..."
              value={filters.search}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="category">프로젝트 종류</label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">전체</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group filter-actions">
            <button onClick={handleReset} className="btn-reset">
              초기화
            </button>
          </div>
        </div>
      </div>

      <div className="results-section">
        <h3>
          검색 결과 ({filteredProjects.length}개)
        </h3>
        {error && (
          <div className="error-message">
            <p>⚠️ 오류 발생: {error}</p>
          </div>
        )}
        {loading && (
          <div className="loading-message">
            <p>로딩 중...</p>
          </div>
        )}
        {!loading && filteredProjects.length === 0 ? (
          <div className="no-results">
            <p>검색 조건에 맞는 프로젝트가 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="projects-grid">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(0)}
                  disabled={currentPage === 0 || loading}
                  className="btn-pagination btn-first"
                  title="첫 페이지"
                >
                  «
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0 || loading}
                  className="btn-pagination btn-prev"
                  title="이전 페이지"
                >
                  ‹
                </button>

                {generatePageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    disabled={loading}
                    className={`btn-pagination ${currentPage === page ? 'active' : ''}`}
                  >
                    {page + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1 || loading}
                  className="btn-pagination btn-next"
                  title="다음 페이지"
                >
                  ›
                </button>
                <button
                  onClick={() => handlePageChange(totalPages - 1)}
                  disabled={currentPage === totalPages - 1 || loading}
                  className="btn-pagination btn-last"
                  title="마지막 페이지"
                >
                  »
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
