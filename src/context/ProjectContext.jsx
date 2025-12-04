import { useState, useEffect, useCallback } from 'react'
import { apiService } from '../services/api'
import { ProjectContext } from './ProjectContextObj'

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [pageSize] = useState(10)
  const [allCategories, setAllCategories] = useState([])

  // Internal function to fetch from API without triggering infinite loops
  const performFetch = useCallback(
    async (filters = {}) => {
      try {
        setLoading(true)
        setError(null)
        console.log('[ProjectContext] performFetch called with filters:', filters)

        // Add pagination parameters to filters
        const apiFilters = {
          ...filters,
          page: filters.page !== undefined ? filters.page : 0,
          size: pageSize,
        }

        const response = await apiService.getProjects(apiFilters)

        if (response.content) {
          // Transform API data to match component's expected format
          const transformedProjects = response.content.map((project) => ({
            id: project.id,
            projectName: project.projectName,
            projectSummary: project.projectSummary,
            source: project.source,
            url: project.url,
            tags: project.tags,
          }))

          console.log('[ProjectContext] Projects fetched successfully:', {
            count: transformedProjects.length,
            page: response.number,
            totalPages: response.totalPages,
            totalElements: response.totalElements,
          })
          setProjects(transformedProjects)
          setCurrentPage(response.number || 0)
          setTotalPages(response.totalPages || 0)
          setTotalElements(response.totalElements || 0)
        } else {
          console.warn('[ProjectContext] Response does not have content field:', response)
        }
      } catch (err) {
        const errorMessage = err.message || 'Unknown error occurred'
        console.error('[ProjectContext] Error fetching projects:', {
          message: errorMessage,
          error: err,
          filters,
        })
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    },
    [pageSize]
  )

  // Load initial data to extract all tags (runs once on mount)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log('[ProjectContext] Loading initial data to extract tags...')
        // Fetch a large page size to get all available tags
        const response = await apiService.getProjects({ page: 0, size: 1000 })

        const extractedTags = new Set()
        if (response.content) {
          response.content.forEach((project) => {
            if (project.tags) {
              // Split comma-separated tags and add each one individually
              const tagsArray = project.tags.split(',').map((tag) => tag.trim())
              tagsArray.forEach((tag) => {
                if (tag) {
                  extractedTags.add(tag)
                }
              })
            }
          })
        }
        const sortedTags = Array.from(extractedTags).sort()
        console.log('[ProjectContext] Extracted all available tags:', sortedTags)
        setAllCategories(sortedTags)
      } catch (err) {
        console.error('[ProjectContext] Error loading initial data:', err)
        setAllCategories([])
      }
    }

    loadInitialData()
  }, [])

  // Initial load of projects (runs once on mount)
  useEffect(() => {
    console.log('[ProjectContext] Initial load - fetching all projects')
    performFetch({})
  }, [performFetch])

  // Exported function for searching
  const searchProjects = useCallback(
    async (filters) => {
      console.log('[ProjectContext] searchProjects called with:', filters)
      // Build API filters - only send one at a time for OR logic
      const apiFilters = {}

      // Priority: if search term exists, use it; otherwise use category
      if (filters.search && filters.search.trim()) {
        console.log('[ProjectContext] Using search term:', filters.search)
        apiFilters.search = filters.search
      } else if (filters.category && filters.category.trim()) {
        console.log('[ProjectContext] Using category:', filters.category)
        apiFilters.category = filters.category
      }

      // Always reset to first page when filtering
      apiFilters.page = 0

      console.log('[ProjectContext] Final API filters:', apiFilters)
      await performFetch(apiFilters)
    },
    [performFetch]
  )

  // Exported function for pagination
  const goToPage = useCallback(
    async (page, currentFilters = {}) => {
      console.log('[ProjectContext] goToPage called with page:', page, 'filters:', currentFilters)
      const apiFilters = {
        page,
      }
      // Priority: if search term exists, use it; otherwise use category (same logic as searchProjects)
      if (currentFilters.search && currentFilters.search.trim()) {
        apiFilters.search = currentFilters.search
      } else if (currentFilters.category && currentFilters.category.trim()) {
        apiFilters.category = currentFilters.category
      }
      await performFetch(apiFilters)
    },
    [performFetch]
  )

  const addProject = async (newProject) => {
    try {
      setLoading(true)
      setError(null)
      console.log('[ProjectContext] Adding new project:', newProject)

      // Transform form data to API format
      const apiPayload = {
        projectName: newProject.name,
        projectSummary: newProject.description,
        source: newProject.source || '',
        url: newProject.url || '',
        tags: newProject.category,
      }

      const response = await apiService.createProject(apiPayload)

      if (response.id) {
        console.log('[ProjectContext] Project created successfully:', response.id)
        // Refresh projects list
        await performFetch({})
        return response
      } else {
        throw new Error('Invalid response: missing project ID')
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to add project'
      console.error('[ProjectContext] Error adding project:', {
        message: errorMessage,
        error: err,
        newProject,
      })
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (projectId) => {
    try {
      setLoading(true)
      setError(null)
      console.log('[ProjectContext] Deleting project:', projectId)

      await apiService.deleteProject(projectId)

      console.log('[ProjectContext] Project deleted successfully:', projectId)
      // Refresh projects list
      await performFetch({})
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete project'
      console.error('[ProjectContext] Error deleting project:', {
        message: errorMessage,
        error: err,
        projectId,
      })
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getCategories = () => {
    // Return all categories extracted from initial data load
    return allCategories
  }

  const filterProjects = (filters) => {
    return projects.filter((project) => {
      const matchCategory = !filters.category || project.tags === filters.category
      const matchSearch =
        !filters.search ||
        project.projectName.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.projectSummary.toLowerCase().includes(filters.search.toLowerCase())

      return matchCategory && matchSearch
    })
  }

  // Fetch projects function (for backwards compatibility, delegates to performFetch)
  const fetchProjects = useCallback(
    async (filters = {}) => {
      console.log('[ProjectContext] fetchProjects called with:', filters)
      await performFetch(filters)
    },
    [performFetch]
  )

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        error,
        currentPage,
        totalPages,
        totalElements,
        pageSize,
        allCategories,
        addProject,
        deleteProject,
        getCategories,
        filterProjects,
        searchProjects,
        fetchProjects,
        goToPage,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}
