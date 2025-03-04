import React from 'react'
import { redirect } from 'next/dist/server/api-utils'
import Header from './components/Header'

export default function Home() {
  return (
    <div>
      <Header/>
    </div>
  )
}
