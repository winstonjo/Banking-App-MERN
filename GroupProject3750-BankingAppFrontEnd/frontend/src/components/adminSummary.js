import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminSummary () {
  const [accounts, setAccounts] = useState([])
  const [selectedAccountID, setSelectedAccountID] = useState('')
  const [selectedRole, setSelectedRole] = useState('Customer')
  const navigate = useNavigate()

  useEffect(() => {
    // Get accounts
    async function fetchAccounts () {
      try {
        const response = await fetch(
          'http://localhost:4000/record/allAccounts',
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
          }
        )

        if (response.ok) {
          const accountsData = await response.json()
          setAccounts(accountsData)
        } else {
          if (response.status === 401) {
            navigate('/') 
          }
          else if(response.status === 404){
            navigate('/accountSummary')
          } else {
            window.alert('Failed to fetch accounts.')
          }
        }
      } catch (error) {
        window.alert('Failed to fetch accounts.')
        console.error(error)
      }
    }

    fetchAccounts()
  }, [navigate])

  const handleRoleChange = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/record/changeRole/${selectedAccountID}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ role: selectedRole })
        }
      )

      if (response.ok) {
        window.alert('Role updated successfully.')
      } else {
        window.alert('Failed to update role.')
      }
    } catch (error) {
      window.alert('Failed to update role.')
      console.error(error)
    }
  }

  const handleUsernameChange = e => {
    const selectedUsername = e.target.value
    const account = accounts.find(acc => acc.username === selectedUsername)
    if (account) {
      setSelectedAccountID(account.accountID)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4'>
      <div className='w-full max-w-2xl bg-white dark:bg-gray-800 shadow-md rounded-lg p-8'>
        <h2 className='text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100'>
          View and Manage Customer Accounts
        </h2>
        <ul className='mb-6'>
          {accounts.map(account => (
            <li
              key={account.accountID}
              className='text-gray-700 dark:text-gray-300 mb-2'
            >
              User: {account.username} | Role: {account.role}
            </li>
          ))}
        </ul>
        <div className='mb-4'>
          <label className='block text-gray-700 dark:text-gray-300 font-bold mb-2'>
            Select Username:
            <select
              onChange={handleUsernameChange}
              className='block w-full mt-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-opacity-50'
            >
              <option value=''>None Selected</option>
              {accounts.map(account => (
                <option key={account.accountID} value={account.username}>
                  {account.username}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 dark:text-gray-300 font-bold mb-2'>
            Role:
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className='block w-full mt-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-opacity-50'
            >
              <option value='Customer'>Customer</option>
              <option value='Admin'>Admin</option>
              <option value='Employee'>Employee</option>
            </select>
          </label>
        </div>
        <button
          onClick={handleRoleChange}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
        >
          Change Role
        </button>
      </div>
    </div>
  )
}
