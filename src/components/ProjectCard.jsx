import { useState } from 'react'
import { useProjects } from '../hooks/useProjects'
import './ProjectCard.css'

export const ProjectCard = ({ project }) => {
  const { deleteProject } = useProjects()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState(null)

  const handleDelete = async () => {
    if (!window.confirm('정말 이 프로젝트를 삭제하시겠습니까?')) {
      return
    }

    try {
      setIsDeleting(true)
      setError(null)
      await deleteProject(project.id)
    } catch (err) {
      setError(err.message || '삭제에 실패했습니다.')
      console.error('Error deleting project:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="project-card">
      <div className="project-card-header">
        <h3>{project.projectName}</h3>
        <span className="project-category">{project.tags || '미분류'}</span>
      </div>
      <div className="project-card-content">
        <p className="project-description">{project.projectSummary}</p>
        <div className="project-details">
          <div className="detail-item">
            <span className="detail-label">출처:</span>
            <span className="detail-value">{project.source || '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">링크:</span>
            <span className="detail-value">
              {project.url ? (
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="project-link">
                  자세히 보기 →
                </a>
              ) : (
                '-'
              )}
            </span>
          </div>
        </div>
        {error && <p className="delete-error">⚠️ {error}</p>}
      </div>
      <div className="project-card-footer">
        <button
          className="btn-delete"
          onClick={handleDelete}
          disabled={isDeleting}
          title="프로젝트 삭제"
        >
          {isDeleting ? '삭제 중...' : '삭제'}
        </button>
      </div>
    </div>
  )
}
