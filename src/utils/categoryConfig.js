/**
 * Centralized category configuration
 * Define all categories and their associated colors here
 */
export const categories = {
  center: {
    name: 'center',
    color: '#10b981',
    label: 'Me'
  },
  experience: {
    name: 'experience',
    color: '#60a5fa',
    label: 'Experience'
  },
  skills: {
    name: 'skills',
    color: '#a78bfa',
    label: 'Skills'
  },
  projects: {
    name: 'projects',
    color: '#f59e0b',
    label: 'Projects'
  },
  security: {
    name: 'security',
    color: '#f472b6',
    label: 'Security'
  }
};

/**
 * Get category config by name
 * @param {string} categoryName - The category name
 * @returns {Object} The category config with name, color, and label
 */
export function getCategoryConfig(categoryName) {
  return categories[categoryName] || categories.projects;
}

/**
 * Get all categories as array for iteration
 * @returns {Array} Array of category objects
 */
export function getAllCategories() {
  return Object.values(categories);
}
