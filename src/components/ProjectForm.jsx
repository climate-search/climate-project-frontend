import { useState } from 'react'
import { useProjects } from '../hooks/useProjects'
import './ProjectForm.css'

export const ProjectForm = ({ onProjectAdded }) => {
  const { addProject, getCategories, loading } = useProjects()
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    source: '',
    url: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const categories = getCategories()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setIsError(false)
    setErrorMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsError(false)
    setErrorMessage('')
    console.log('[ProjectForm] Form submitted with data:', formData)

    if (!formData.name.trim() || !formData.category || !formData.description.trim()) {
      const validationError = '필수 항목을 모두 입력해주세요.'
      console.warn('[ProjectForm] Validation failed:', {
        name: formData.name,
        category: formData.category,
        description: formData.description,
      })
      setIsError(true)
      setErrorMessage(validationError)
      return
    }

    try {
      setIsLoading(true)
      console.log('[ProjectForm] Submitting project to API...')
      await addProject(formData)
      console.log('[ProjectForm] Project submitted successfully')
      setIsSubmitted(true)

      setFormData({
        name: '',
        category: '',
        description: '',
        source: '',
        url: '',
      })

      setTimeout(() => {
        setIsSubmitted(false)
      }, 3000)

      if (onProjectAdded) {
        onProjectAdded()
      }
    } catch (error) {
      const errorMsg = error.message || '프로젝트 등록에 실패했습니다.'
      console.error('[ProjectForm] Error submitting project:', {
        message: errorMsg,
        error,
        formData,
      })
      setIsError(true)
      setErrorMessage(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="project-form-container">
      <div className="form-header">
        <h2>새 프로젝트 등록</h2>
        <p>기후 관련 프로젝트 정보를 등록해주세요.</p>
      </div>

      {isSubmitted && <div className="success-message">✓ 프로젝트가 성공적으로 등록되었습니다!</div>}
      {isError && <div className="error-message">⚠️ {errorMessage}</div>}

      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-group">
          <label htmlFor="name">
            프로젝트명 <span className="required">*</span>
          </label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="프로젝트 이름을 입력하세요"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">
              프로젝트 종류 <span className="required">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">선택하세요</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="기타">기타 (새로운 종류)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="source">출처</label>
            <input
              id="source"
              type="text"
              name="source"
              placeholder="예: GCF, UNEP, 한국환경정책평가연구원"
              value={formData.source}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="url">링크 (URL)</label>
          <input
            id="url"
            type="url"
            name="url"
            placeholder="https://example.com"
            value={formData.url}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">
            프로젝트 설명 <span className="required">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="프로젝트에 대한 자세한 설명을 입력하세요"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            rows="5"
            required
          />
        </div>

        <button type="submit" className="btn-submit" disabled={isLoading || loading}>
          {isLoading ? '등록 중...' : '프로젝트 등록'}
        </button>
      </form>
    </div>
  )
}
