// Can view any account associated with a bank customer ID
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EmployeeSummary () {
  const [accounts, setAccounts] = useState([])
  const [selectedAccountID, setSelectedAccountID] = useState('')
  const [singleSelectedAccountID, setSingleSelectedAccountID] = useState('')
  const [amount, setAmount] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [accountType, setAccountType] = useState('savings') // Default to savings
  const [targetAccountID, setTargetAccountID] = useState('')
  const [targetAccountType, setTargetAccountType] = useState('savings') // Default to savings
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
          }
          else {
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

  // Deposit/Withdraw
  const handleTransaction = async transactionType => {
    try {
      const response = await fetch('http://localhost:4000/record/employeeSummary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          accountID: Number(singleSelectedAccountID),
          transactionType,
          accountType,
          amount: Number(amount)
        })
      })

      if (response.ok) {
        window.alert('Transaction successful')
      } else {
        window.alert('Transaction failed.')
      }
    } catch (error) {
      window.alert('Transaction failed.')
      console.log('Transaction error')
    }
  }

  // Transfer between users
  const handleTransfer = async () => {
    try {
      const response = await fetch('http://localhost:4000/record/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          fromAccountID: Number(selectedAccountID),
          fromAccountType: accountType,
          toAccountID: targetAccountID,
          toAccountType: targetAccountType,
          transferAmount: Number(transferAmount)
        })
      })

      if (response.ok) {
        window.alert('Transfer successful')
      } else {
        window.alert('Transfer failed.')
      }
    } catch (error) {
      window.alert('Transfer failed.')
      console.error(error)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4'>
      <div className='w-full max-w-2xl bg-white dark:bg-gray-800 shadow-md rounded-lg p-8'>
        <h2 className='text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100'>
          View and Manage Customer Accounts
        </h2>
        <h2 className='mb-6 text-gray-700 dark:text-gray-300'>
          {accounts.map(account => (
            <h1 key={account.accountID} className='mb-2'>
              Account ID: {account.accountID} 
              <br></br> 
              Username: {account.username}
            </h1>
          ))}
        </h2>
        <div className='mb-6'>
          <h2 className='text-xl font-bold mb-4 text-gray-900 dark:text-gray-100'>
            Deposit or Withdraw Money
          </h2>
          <label className='block text-gray-700 dark:text-gray-300 font-bold mb-2'>
            Account ID:
            <input
              type='text'
              value={singleSelectedAccountID}
              onChange={e => setSingleSelectedAccountID(e.target.value)}
              className='block w-full mt-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-opacity-50'
            />
          </label>
          <label className='block text-gray-700 dark:text-gray-300 font-bold mb-2'>
            Account Type:
            <select
              value={accountType}
              onChange={e => setAccountType(e.target.value)}
              className='block w-full mt-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-opacity-50'
            >
              <option value='savings'>Savings</option>
              <option value='checkings'>Checking</option>
              <option value='investments'>Investments</option>
            </select>
          </label>
          <label className='block text-gray-700 dark:text-gray-300 font-bold mb-2'>
            Amount:
            <input
              type='text'
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className='block w-full mt-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-opacity-50'
            />
          </label>
          <div className='flex space-x-4 mt-4'>
            <button
              onClick={() => handleTransaction('deposit')}
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            >
              Deposit
            </button>
            <button
              onClick={() => handleTransaction('withdraw')}
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            >
              Withdraw
            </button>
          </div>
        </div>
        <div>
          <h2 className='text-xl font-bold mb-4 text-gray-900 dark:text-gray-100'>
            Transfer Money
          </h2>
          <label className='block text-gray-700 dark:text-gray-300 font-bold mb-2'>
            From: Account ID
            <input
              type='text'
              value={selectedAccountID}
              onChange={e => setSelectedAccountID(e.target.value)}
              className='block w-full mt-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-opacity-50'
            />
          </label>
          <label className='block text-gray-700 dark:text-gray-300 font-bold mb-2'>
            To: Account ID
            <input
              type='text'
              value={targetAccountID}
              onChange={e => setTargetAccountID(e.target.value)}
              className='block w-full mt-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-opacity-50'
            />
          </label>
          <label className='block text-gray-700 dark:text-gray-300 font-bold mb-2'>
            Amount:
            <input
              type='text'
              value={transferAmount}
              onChange={e => setTransferAmount(e.target.value)}
              className='block w-full mt-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-opacity-50'
            />
          </label>
          <label className='block text-gray-700 dark:text-gray-300 font-bold mb-2'>
            Target Account Type:
            <select
              value={targetAccountType}
              onChange={e => setTargetAccountType(e.target.value)}
              className='block w-full mt-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-opacity-50'
            >
              <option value='savings'>Savings</option>
              <option value='checking'>Checking</option>
              <option value='investments'>Investments</option>
            </select>
          </label>
          <button
            onClick={handleTransfer}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4'
          >
            Transfer
          </button>
        </div>
      </div>
    </div>
  )
}
