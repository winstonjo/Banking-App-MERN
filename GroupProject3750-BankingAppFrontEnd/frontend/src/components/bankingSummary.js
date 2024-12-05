import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BankingSummary() {
  const [form, setForm] = useState({
    transactionType: 'deposit',
    amount: 0,
    account: 'savings',
  });
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const handleForm = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  useEffect(() => {
    async function checkAuth() {
      try {
        console.log('inside frontend check auth');
        const response = await fetch(
          'http://localhost:4000/record/accountSummary',
          {
            method: 'GET',
            credentials: 'include',
          }
        );
        if (!response.ok) {
          console.log('Response has failed');
          if (response.status === 201) {
            navigate('/login');
          } else {
            const message = `An error occurred: ${response.statusText}`;
            window.alert(message);
          }
          return;
        }

        if (response.status === 201) {
          window.alert('Please login first!');
          navigate('/login');
        }

        setAuthenticated(true); // set the Auth state to True
      } catch (err) {
        navigate('/login');
      }
    }

    async function fetchData() {
      try {
        console.log('inside frontend account fetch');
        const response = await fetch(
          'http://localhost:4000/record/accountSummary',
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (!response.ok) {
          if (response.status === 200) {
            navigate('/login');
          } else {
            const message = `An error occurred: ${response.statusText}`;
            window.alert(message);
          }
          return;
        }

        if (response.status === 201) {
          window.alert('Please login first!');
          navigate('/login');
        }

        const accountResponse = await response.json();
        setUser(accountResponse);
      } catch (error) {
        window.alert('Failed to fetch account information');
        console.error(error);
      }
    }

    checkAuth();
    fetchData();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('inside frontend Banking Summary');
      const response = await fetch(
        'http://localhost:4000/record/bankingSummary',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'bankingSummary failed');
      }
      navigate('/accountSummary');
    } catch (err) {
      alert('Unable to complete transaction: ' + err.message);
    }
  };

  if (!authenticated) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        Loading...
      </div>
    );
  }
  if (!user) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        Loading...
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4'>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-lg bg-white dark:bg-gray-800 shadow-md rounded-lg p-8'
      >
        <div className='mb-6'>
          <p className='text-gray-700 dark:text-gray-300'>
            <span className='font-semibold'>Savings:</span> {user.savings}
          </p>
          <p className='text-gray-700 dark:text-gray-300'>
            <span className='font-semibold'>Checkings:</span> {user.checkings}
          </p>
          <p className='text-gray-700 dark:text-gray-300'>
            <span className='font-semibold'>Investments:</span> {user.investments}
          </p>
        </div>
        <div className='mb-4'>
          <label
            htmlFor='transactionType'
            className='block text-gray-700 dark:text-gray-300 font-bold mb-2'
          >
            Transaction Type:
          </label>
          <label className='block'>
            <input
              type='radio'
              id='deposit'
              name='transactionType'
              value='deposit'
              required
              checked={form.transactionType === 'deposit'}
              onChange={handleForm}
              className='mr-2'
            />
            Deposit
          </label>
          <label className='block'>
            <input
              type='radio'
              id='withdraw'
              name='transactionType'
              value='withdraw'
              checked={form.transactionType === 'withdraw'}
              onChange={handleForm}
              className='mr-2'
            />
            Withdrawal
          </label>
        </div>
        <div className='mb-4'>
          <label
            htmlFor='account'
            className='block text-gray-700 dark:text-gray-300 font-bold mb-2'
          >
            Account Type:
          </label>
          <label className='block'>
            <input
              type='radio'
              id='savings'
              name='account'
              value='savings'
              required
              checked={form.account === 'savings'}
              onChange={handleForm}
              className='mr-2'
            />
            Savings
          </label>
          <label className='block'>
            <input
              type='radio'
              id='checkings'
              name='account'
              value='checkings'
              checked={form.account === 'checkings'}
              onChange={handleForm}
              className='mr-2'
            />
            Checking
          </label>
          <label className='block'>
            <input
              type='radio'
              id='investments'
              name='account'
              value='investments'
              required
              checked={form.account === 'investments'}
              onChange={handleForm}
              className='mr-2'
            />
            Investments
          </label>
        </div>
        <div className='mb-6'>
          <label
            htmlFor='amount'
            className='block text-gray-700 dark:text-gray-300 font-bold mb-2'
          >
            Amount:
          </label>
          <input
            name='amount'
            type='number'
            value={form.amount}
            onChange={handleForm}
            required
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
        <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
        >
          Submit
        </button>
      </form>
      <div className='mt-8 w-full max-w-lg bg-white dark:bg-gray-800 shadow-md rounded-lg p-8'>
        <label className='block text-gray-700 dark:text-gray-300 font-bold mb-2'>
          Transaction History
        </label>
        <ul className='mb-6'>
          {user.transactionHistory && user.transactionHistory.length > 0 ? (
            user.transactionHistory.map((transaction, index) => ( //List out each 
              <li key={index} className='text-gray-700 dark:text-gray-300 mb-2'>
                Time: {transaction.timestamp} Type: {transaction.type} of ${transaction.amount} to {transaction.account}
              </li>
            ))
          ) : (
            <li className='text-gray-700 dark:text-gray-300'>No Transactions Found</li>
          )}
        </ul>
      </div>
    </div>
  );
}