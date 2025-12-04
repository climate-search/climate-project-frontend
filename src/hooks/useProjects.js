import { useContext } from 'react'
import { ProjectContext } from '../context/ProjectContextObj'

export const useProjects = () => {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProjects must be used within ProjectProvider')
  }
  return context
}
