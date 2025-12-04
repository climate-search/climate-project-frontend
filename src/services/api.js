// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://d5vsl8ys4dpxf.cloudfront.net'

// Log the API Base URL on initialization
console.log('[API] Base URL configured:', API_BASE_URL)

// Logger utility
const logger = {
  info: (message, data) => {
    console.log(`[API INFO] ${message}`, data || '')
  },
  error: (message, data) => {
    console.error(`[API ERROR] ${message}`, data || '')
  },
  warn: (message, data) => {
    console.warn(`[API WARN] ${message}`, data || '')
  },
}

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorData = {}
    try {
      errorData = await response.json()
    } catch {
      logger.warn('Failed to parse error response as JSON')
    }

    const errorMessage = errorData.message || `API Error: ${response.status} ${response.statusText}`
    logger.error('API Response Error', {
      status: response.status,
      statusText: response.statusText,
      message: errorMessage,
      url: response.url,
      errorData,
    })
    throw new Error(errorMessage)
  }
  return response.json()
}

// API Service
export const apiService = {
  // Get all projects
  async getProjects(filters = {}) {
    const params = new URLSearchParams()

    // Add search and tag filters
    if (filters.search) params.append('name', filters.search)
    if (filters.category) params.append('tags', filters.category)

    // Add pagination parameters
    const page = filters.page !== undefined ? filters.page : 0
    const size = filters.size !== undefined ? filters.size : 10
    params.append('page', page)
    params.append('size', size)

    const url = `${API_BASE_URL}/api/mainpage?${params.toString()}`

    try {
      logger.info('GET Projects Request', {
        url,
        page,
        size,
        searchTerm: filters.search || 'none',
        selectedTag: filters.category || 'none (showing all)',
      })

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await handleResponse(response)
      logger.info('GET Projects Success', {
        count: data.content?.length || 0,
        totalElements: data.totalElements,
      })
      return data
    } catch (error) {
      logger.error('GET Projects Failed', {
        url,
        filters,
        error: error.message,
      })
      throw error
    }
  },

  // Create a new project
  async createProject(projectData) {
    try {
      logger.info('POST Project Request', {
        url: `${API_BASE_URL}/api/mainpage`,
        data: projectData,
      })

      const response = await fetch(`${API_BASE_URL}/api/mainpage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })

      const data = await handleResponse(response)
      logger.info('POST Project Success', {
        id: data.id,
        name: data.projectName,
      })
      return data
    } catch (error) {
      logger.error('POST Project Failed', {
        url: `${API_BASE_URL}/api/mainpage`,
        data: projectData,
        error: error.message,
      })
      throw error
    }
  },

  // Delete a project
  async deleteProject(projectId) {
    try {
      logger.info('DELETE Project Request', {
        url: `${API_BASE_URL}/api/mainpage/${projectId}`,
        projectId,
      })

      const response = await fetch(`${API_BASE_URL}/api/mainpage/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await handleResponse(response)
      logger.info('DELETE Project Success', {
        projectId,
      })
      return data
    } catch (error) {
      logger.error('DELETE Project Failed', {
        url: `${API_BASE_URL}/api/mainpage/${projectId}`,
        projectId,
        error: error.message,
      })
      throw error
    }
  },
}
