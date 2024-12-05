import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Create() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/record/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      if (response.status === 400) {
        window.alert('Username already exists');
        setForm({ username: '', password: '', role: '' });
      } else {
        navigate('/accountSummary');
      }
    } catch (err) {
      window.alert('Account creation failed: ' + err.message);
      setForm({ username: '', password: '', role: '' });
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4'>
      <div className='w-full max-w-2xl bg-white dark:bg-gray-800 shadow-md rounded-lg p-8'>
        <form onSubmit={handleSubmit}>
          <h1 className='text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100'>
          Account Creation</h1>
      <div className='mb-4'>
        <label
          htmlFor='transactionType'
          className='block text-gray-700 dark:text-gray-300 font-bold mb-2'>Username:</label>
        <input
          name="username"
          type="text"
          value={form.username}
          onChange={handleChange}
           className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline'
        />
      </div>
        <label
          htmlFor='transactionType'
          className='block text-gray-700 dark:text-gray-300 font-bold mb-2'>Password:</label>
      <div>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline'
        />
      </div>
      <br></br>
        <label
          htmlFor='role'
          className='block text-gray-700 dark:text-gray-300 font-bold mb-2'>
            Role:</label>
            <label className='block'>
            admin&nbsp; 
            <input
              type='radio'
              id='admin'
              name='role'
              value='admin'
              required
              checked={form.role === 'admin'}
              onChange={handleChange}
              className='mr-2'
            />
  
          </label>
          <label className='block'>
            customer&nbsp; 
            <input
              type='radio'
              id='customer'
              name='role'
              value='customer'
              required
              checked={form.role === 'customer'}
              onChange={handleChange}
              className='mr-2'
            />
  
          </label>
          <label className='block'>
            employee&nbsp; 
            <input
              type='radio'
              id='employee'
              name='role'
              value='employee'
              required
              checked={form.role === 'employee'}
              onChange={handleChange}
              className='mr-2'
            />
  
          </label>
          <br></br>
      <button
      type='submit'
      className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
        Create Account</button>
    </form>
      </div>
  </div>
  );
}
