import React from 'react'

const DarkModeToggle = () => {
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark')
  }

  return (
    <button
      onClick={toggleDarkMode}
      className='bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded'
    >
      Dark Mode
    </button>
  )
}

export default DarkModeToggle
