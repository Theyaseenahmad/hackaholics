import Link from 'next/link'
import React from 'react'

const page = () => {
    // manual form
  return (
    <div className='w-full h-screen flex flex-col items-center justify-center'>
        <div className='size-52 aspect-square flex items-center justify-center'>form</div>
        <div>already have an account ? <Link className='text-sky-700' href={'/farmer/login'}>login</Link></div>
    </div>
  )
}

export default page