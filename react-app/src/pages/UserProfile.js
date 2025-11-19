import React, { useEffect, useState } from 'react'
import supabase from '../supabaseClient'

export default function UserProfile() {
  const [user, setUser] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user || null)
      if (data?.user?.user_metadata?.avatar_url) setAvatarUrl(data.user.user_metadata.avatar_url)
    }
    getUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const uploadAvatar = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const filePath = `avatars/${user.id}/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('avatars').upload(filePath, file)
    if (error) {
      alert(error.message)
      setUploading(false)
      return
    }
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
    // Save avatar URL to user metadata (optional)
    await supabase.auth.updateUser({ data: { avatar_url: data.publicUrl } })
    setAvatarUrl(data.publicUrl)
    setUploading(false)
  }

  if (!user) return <p>Please sign in to view your profile.</p>

  return (
    <div style={{maxWidth:600, margin:'2rem auto'}}>
      <h2>Profile</h2>
      <p>Email: {user.email}</p>
      {avatarUrl && <img src={avatarUrl} alt="avatar" style={{width:100,height:100,borderRadius:50}} />}
      <div style={{marginTop:10}}>
        <label style={{display:'block',marginBottom:6}}>Upload avatar</label>
        <input type="file" accept="image/*" onChange={uploadAvatar} disabled={uploading} />
      </div>
      <button onClick={handleSignOut} style={{marginTop:12}}>Sign out</button>
    </div>
  )
}
