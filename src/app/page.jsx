import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='h-screen w-full flex flex-col items-center justify-center'>welcome page
    <Link href={'/farmer/register'}>Get started as a farmer</Link>

    <Link href={'/customer/register'}>register as a customer</Link>
    </div>
  )
}

export default page