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
  const [allFilteredProjects, setAllFilteredProjects] = useState([])

  // Internal function to fetch from API without triggering infinite loops
  const performFetch = useCallback(
    async (filters = {}) => {
      try {
        setLoading(true)
        setError(null)
        console.log('[ProjectContext] performFetch called with filters:', filters)

        // Build API filters - ensure only ONE of search/category is sent (not both)
        const apiFilters = {
          page: filters.page !== undefined ? filters.page : 0,
          size: filters.size !== undefined ? filters.size : pageSize,
        }

        // Only add ONE filter: prioritize search over category
        if (filters.search && filters.search.trim().length > 0) {
          apiFilters.search = filters.search
          console.log('[ProjectContext] Adding search filter:', filters.search)
        } else if (filters.category && filters.category.trim().length > 0) {
          apiFilters.category = filters.category
          console.log('[ProjectContext] Adding category filter:', filters.category)
        }

        console.log('[ProjectContext] Final apiFilters:', apiFilters)
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
      // Get ALL projects from API (no filters sent to API)
      // Then filter locally on the frontend
      const apiFilters = {
        page: 0,
        size: 1000, // Get all projects
      }
      console.log('[ProjectContext] Fetching all projects, then filtering locally with:', filters)

      try {
        setLoading(true)
        setError(null)

        // Fetch all projects without any filters
        const response = await apiService.getProjects(apiFilters)

        if (response.content) {
          let filteredProjects = response.content

          // Apply search filter if provided
          const hasSearch = filters.search && filters.search.trim().length > 0
          const hasCategory = filters.category && filters.category.trim().length > 0

          if (hasSearch || hasCategory) {
            console.log('[ProjectContext] Applying filters - search:', hasSearch, 'category:', hasCategory)
            filteredProjects = filteredProjects.filter((project) => {
              // Check search filter
              let matchesSearch = true
              if (hasSearch) {
                const searchTerm = filters.search.toLowerCase()
                matchesSearch =
                  project.projectName.toLowerCase().includes(searchTerm) ||
                  project.projectSummary.toLowerCase().includes(searchTerm)
              }

              // Check category filter
              let matchesCategory = true
              if (hasCategory) {
                const categoryTerm = filters.category.trim()
                const tags = project.tags.split(',').map((tag) => tag.trim())
                matchesCategory = tags.includes(categoryTerm)
              }

              // Return true only if BOTH conditions are met (AND logic)
              return matchesSearch && matchesCategory
            })
            console.log('[ProjectContext] Applied filters - results:', filteredProjects.length)
          }

          // Transform all filtered projects
          const transformedProjects = filteredProjects.map((project) => ({
            id: project.id,
            projectName: project.projectName,
            projectSummary: project.projectSummary,
            source: project.source,
            url: project.url,
            tags: project.tags,
          }))

          console.log('[ProjectContext] Filtered results count:', transformedProjects.length)

          // Calculate pagination
          const totalCount = transformedProjects.length
          const itemsPerPage = pageSize
          const totalPagesCount = Math.ceil(totalCount / itemsPerPage)
          const currentPageNum = 0 // Start from page 0

          // Get only the first page of results (page 0, items 0-9)
          const pagedProjects = transformedProjects.slice(
            currentPageNum * itemsPerPage,
            (currentPageNum + 1) * itemsPerPage
          )

          console.log(
            `[ProjectContext] Showing page ${currentPageNum} with ${pagedProjects.length} items out of ${totalCount} total`
          )
          setAllFilteredProjects(transformedProjects) // Store all results for pagination
          setProjects(pagedProjects)
          setCurrentPage(currentPageNum)
          setTotalPages(totalPagesCount)
          setTotalElements(totalCount)
        }
      } catch (err) {
        console.error('[ProjectContext] Error searching:', err)
        setError(err.message || 'Failed to search projects')
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // Exported function for pagination
  const goToPage = useCallback(
    async (page) => {
      console.log('[ProjectContext] goToPage called with page:', page)

      // If we have filtered results (from search), paginate through them
      if (allFilteredProjects.length > 0) {
        console.log('[ProjectContext] Paginating through filtered results')
        const itemsPerPage = pageSize
        const startIdx = page * itemsPerPage
        const endIdx = (page + 1) * itemsPerPage
        const pagedProjects = allFilteredProjects.slice(startIdx, endIdx)

        console.log(
          `[ProjectContext] Showing page ${page} with ${pagedProjects.length} items`
        )
        setProjects(pagedProjects)
        setCurrentPage(page)
        return
      }

      // Otherwise, fetch from API (for initial page load)
      console.log('[ProjectContext] Fetching from API for page:', page)
      const apiFilters = {
        page,
      }
      await performFetch(apiFilters)
    },
    [allFilteredProjects, pageSize, performFetch]
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
