import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AccountsInfo () {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch account information on component mount
    async function fetchData () {
      try {
        const response = await fetch(
          'http://localhost:4000/record/accountSummary',
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
          }
        )

        if (!response.ok) {
          if (response.status === 200) {
            navigate('/')
          } else {
            const message = `An error occurred: ${response.statusText}`
            window.alert(message)
          }
          return
        }
        if (response.status === 201) {
          window.alert('Username and Password were incorrectly entered')
          navigate('/')
        }

        const accountResponse = await response.json()
        setUser(accountResponse)
      } catch (error) {
        window.alert('Username and Password were incorrectly entered')
        console.error(error)
      }
    }

    fetchData()
  }, [navigate]) //before you run the page

  if (!user) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        Loading...
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4'>
      <div className='w-full max-w-2xl bg-white dark:bg-gray-800 shadow-md rounded-lg p-8'>
        <h1 className='text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100'>
          Account Summary
        </h1>
        <div className='mb-4'>
          <p className='text-gray-700 dark:text-gray-300'>
            <span className='font-semibold'>AccountID:</span> {user.accountID}
          </p>
          <p className='text-gray-700 dark:text-gray-300'>
            <span className='font-semibold'>Username:</span> {user.username}
          </p>
          <p className='text-gray-700 dark:text-gray-300'>
            <span className='font-semibold'>Investments:</span>{' '}
            {user.investments}
          </p>
          <p className='text-gray-700 dark:text-gray-300'>
            <span className='font-semibold'>Checking:</span> {user.checkings}
          </p>
          <p className='text-gray-700 dark:text-gray-300'>
            <span className='font-semibold'>Savings:</span> {user.savings}
          </p>
        </div>
      </div>
    </div>
  )
}
