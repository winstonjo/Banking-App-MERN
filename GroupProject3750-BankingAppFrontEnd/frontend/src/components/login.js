import React, { useState  } from "react";
import { useNavigate } from 'react-router-dom'
import DarkModeToggle from './DarkModeToggle'

export default function Login(){
    const [form, setForm] = useState({
        username: "",
        password: ""

    });
    const navigate = useNavigate();


    const updateForm = e => {
        const { name, value } = e.target
        setForm(prevForm => ({...prevForm,[name]: value}))
      }
    

     const onSubmit = async e => {
        e.preventDefault();
        // const newPerson = {...form};
        const response =  await fetch("http://localhost:4000/record/login", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            credentials: 'include',
            body: JSON.stringify(form),
        })
        .catch(error => {
            window.alert(error);
            return
        });

        if(response.ok)
        { //message says its valid navigate to next page
           navigate("/accountSummary")

        } else {
            window.alert("An error occured during the login process...")
                 setForm({username: "", password: ""}); //clear the form
        }
   
    }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900'>
      <div>
        <DarkModeToggle />
      </div>
      <div className='w-full max-w-md'>
        <h3 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>
          Login
        </h3>
        <form
          onSubmit={onSubmit}
          className='bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4'
        >
          <div className='mb-4'>
            <label
              className='block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2'
              htmlFor='username'
            >
              Username:
            </label>
            <input
              type='text'
              name='username'
              id='username'
              value={form.username}
              onChange={updateForm}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline'
            />
          </div>
          <div className='mb-6'>
            <label
              className='block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2'
              htmlFor='password'
            >
              Password:
            </label>
            <input
              type='password'
              name='password'
              id='password'
              value={form.password}
              onChange={updateForm}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 mb-3 leading-tight focus:outline-none focus:shadow-outline'
            />
          </div>
          <div className='flex items-center justify-between'>
            <input
              type='submit'
              value='Login'
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            />
          </div>
        </form>
      </div>
    </div>
  )
}
