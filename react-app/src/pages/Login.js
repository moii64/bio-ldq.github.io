import React, { useState } from 'react'
import supabase from '../supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSignIn = async (e) => {
    e.preventDefault()
    setMessage('Sending magic link...')
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) setMessage('Error: ' + error.message)
    else setMessage('Magic link sent. Check your email.')
  }

  return (
    <div style={{maxWidth:400, margin:'2rem auto'}}>
      <h2>Sign in</h2>
      <form onSubmit={handleSignIn}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={{width:'100%',padding:8,marginBottom:8}} />
        <button type="submit">Send magic link</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}
