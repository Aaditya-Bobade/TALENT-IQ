import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { SignInButton, SignOutButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Welocome to app</h1>
      <div>
        
      </div>
      <SignedOut>

      <SignInButton />
      </SignedOut>

      <SignedIn>
        <SignOutButton />
      </SignedIn>

      <UserButton />
    </>
  )
}

export default App
