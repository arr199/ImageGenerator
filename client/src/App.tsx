/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState } from 'react'

function App (): JSX.Element {
  const [formData, setFormData] = useState<UserInput>({ user: '', age: '', id: '', message: '' })
  const [response, setResponse] = useState<string[]>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  function handleGetPost (e: React.FormEvent): void {
    setFormData({ user: '', age: '', id: '', message: '' })
    e.preventDefault()
    fetch('https://image-generator-server-ypgr-dev.fl0.io/users')
      .then(async res => await res.json())
      .then(data => {
        setResponse(data)
      })
      .catch(err => { console.log('ERROR : ', err) })
  }
  function handlePostUser (): void {
    fetch('https://image-generator-server-ypgr-dev.fl0.io/users'
      , {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: formData.user, age: Number(formData.age) })
      }
    )
      .then(async res => await res.json())
      .then(data => {
        setResponse(data)
      })
      .catch(err => {
        console.log('ERROR : ', err)
      })
    setFormData({ user: '', age: '', id: '', message: '' })
  }
  function handleGetUserById (): void {
    fetch(`https://image-generator-server-ypgr-dev.fl0.io/users/${formData.id}`)
      .then(async res => await res.json())
      .then(data => {
        setResponse(data)
      }).catch(err => { console.log('ERROR : ', err) })
    setFormData({ user: '', age: '', id: '', message: '' })
  }
  function handleUpdateUser (): void {
    fetch(`https://image-generator-server-ypgr-dev.fl0.io/users/${formData.id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: formData.user, age: Number(formData.age) })
      })
      .then(async res => await res.json())
      .then(data => { setResponse(data) })
      .catch(err => { console.log('ERROR : ', err) })
    setFormData({ user: '', age: '', id: '', message: '' })
  }

  function handleDeleteUser (): void {
    async function deleteUser (): Promise<void> {
      try {
        const res = await fetch(`https://image-generator-server-ypgr-dev.fl0.io/users/${formData.id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        })
        const data = await res.json()
        setResponse(data)
      } catch (err) {
        console.log('Error : ', err)
      }
      setFormData({ user: '', age: '', id: '', message: '' })
    }
    deleteUser().catch(err => { console.log(err) })
  }
  function handleSendEmail (e: React.FormEvent): void {
    setIsLoading(true)
    e.preventDefault()

    fetch('https://image-generator-server-ypgr-dev.fl0.io/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: formData.message
      })
    })
      .then(async res => await res.json())
      .then(data => {
        setResponse(data)
      })
      .catch(err => { console.log('ERROR : ', err) })
      .finally(() => {
        setFormData({ ...formData, message: '' })
        setIsLoading(false)
      })
    setFormData({ user: '', age: '', id: '', message: '' })
  }

  return (
    <>
    <header className="bg-slate-800 h-16 text-white px-4" >
      <nav className="flex items-center h-full">
      </nav>

    </header>
    <main className="flex justify-evenly bg-slate-100">
        <section className="px-10 py-2">
          <h1 className="font-bold text-2xl pb-4">Server Request</h1>
          <ul>
            <li>
              <span className="font-bold text-purple-600">GET:</span> Retrieve all the users data from the server / <span className="font-bold">no fields required</span>
            </li>
            <li>
              <span className="font-bold text-purple-600">GET BY ID:</span> Retrieve the data from the user with the specific id / <span className="font-bold">[ id ] - required</span>
            </li>
            <li>
              <span className="font-bold text-purple-600">POST:</span> Create a new user in the server with the provided username and age , the server will generate an id  / <span className="font-bold">[ username, age ] - required</span>
            </li>
            <li>
              <span className="font-bold text-purple-600">PUT:</span> Modify the user with the specific id , updating the username and age  / <span className="font-bold">[ username, age, id ] - required</span>
            </li>
            <li>
               <span className="font-bold text-purple-600">DELETE:</span> Delete the user with the specific id / <span className="font-bold">[ id ] - required</span>
            </li>
            <li>
               <span className="font-bold text-purple-600">SEND EMAIL:</span> Send an email from the server to a gmail account <span className="font-bold">[ message ] - required</span>
            </li>
          </ul>

        </section>
        <section className="px-4 h-screen  flex flex-col gap-4 ">
          <h1 className="font-bold py-2  text-xl bg-slate-100">Testing server endpoints and HTTP methods</h1>
          {/* PROMPT FORM */}
          <form onSubmit={handleGetPost}
            className="container-shadow p-4 rounded  flex flex-col items-start bg-white max-w-[600px] gap-2">
            <label className="font-bold">User info</label>
            <input value={formData.user} onChange={(e) => { setFormData(old => ({ ...old, user: e.target.value })) }} className="w-full p-4  outline-none text-[15px] bg-white border-[1px]  rounded  border-slate-200" placeholder="user"></input>
            <input value={formData.age} onChange={(e) => { setFormData(old => ({ ...old, age: e.target.value })) }} className="w-full p-4  outline-none text-[15px] bg-white border-[1px]  rounded  border-slate-200" placeholder="age" type="number"></input>
            <input value={formData.id} onChange={(e) => { setFormData(old => ({ ...old, id: e.target.value })) }} className="w-full p-4  outline-none text-[15px] bg-white border-[1px]  rounded  border-slate-200" placeholder="id" ></input>

            <div className="flex justify-between gap-2">
              {/* GET */}
              <button className="bg-violet-600  text-white px-4 py-2 rounded mt-auto hover:bg-violet-500 active:scale-95  disabled:bg-violet-300" type="submit" >GET</button>
              {/* GET USER BY ID */}
              <button disabled={formData?.id.length < 1 } onClick={handleGetUserById} className="bg-violet-600 text-white px-4 py-2 rounded mt-auto hover:bg-violet-500 active:scale-95  disabled:bg-violet-300" type="button">GET BY ID</button>

              {/* POST */}
              <button disabled={formData?.user.length < 1 || !formData?.age} onClick={handlePostUser} className="bg-violet-600 text-white px-4 py-2 rounded mt-auto hover:bg-violet-500 active:scale-95  disabled:bg-violet-300" type="button" >POST</button>
              {/* PUT */}
              <button disabled={formData?.user.length < 1 || !formData?.age || formData?.id.length < 1} onClick={handleUpdateUser} className="bg-violet-600 text-white px-4 py-2 rounded mt-auto hover:bg-violet-500 active:scale-95  disabled:bg-violet-300" type="button" >PUT</button>
              {/* DELETE */}
              <button disabled={formData?.id.length < 1 } onClick={handleDeleteUser} className="bg-violet-600 text-white px-4 py-2 rounded mt-auto hover:bg-violet-500 active:scale-95   disabled:bg-violet-300" type="button">DELETE</button>
            </div>

          </form>
          {/* SEND EMAIL FORM */}
          <form onSubmit={handleSendEmail} className="container-shadow flex flex-col max-w-[600px] p-4 border bg-white gap-2">
            <label className=" font-bold">Your message here</label>
            <input value={formData.message} onChange={(e) => { setFormData(old => ({ ...old, message: e.target.value })) }}
              className="w-full p-4  outline-none text-[15px] bg-white border-[1px]  rounded  border-slate-200" placeholder="message" ></input>
            <button disabled={formData.message.length < 1 } className="bg-violet-600 self-start text-white px-4 py-2 rounded mt-auto hover:bg-violet-500 active:scale-95 disabled:bg-violet-300" >{isLoading ? 'SENDING' : 'SEND EMAIL'}</button>
          </form>
          {/* RESPONSE */}
          <div
            className="container-shadow p-4 w-[600px] bg-white  rounded flex flex-col gap-2">
            <h1 className="font-bold">Server Response</h1>
            <div className="px-4 py-2 w-full h-[80%] border-[1px] rounded border-slate-200">
              <p className="text-sm" >{response && JSON.stringify(response)}</p>
            </div>
          </div>
        </section>
    </main>

    </>
  )
}

export default App
