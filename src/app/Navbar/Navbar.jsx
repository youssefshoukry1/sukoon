"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
export default function Navbar() {
  const pathname = usePathname();
  console.log(pathname)
  return (
    <div className=''>
      <Link href="/" className={pathname == '/' ? 'active-link' :' nav-link'}>Home</Link>
    </div>
  )
}
