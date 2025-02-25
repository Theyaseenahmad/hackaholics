import Link from 'next/link'
import React from 'react'

const page = () => {
    // manual form
  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
        <div className='size-52 aspect-square flex items-center justify-center'>form</div>

        <div>continue with  <button className='text-sky-700'> google</button></div>
        <div>already have an account ? <Link className='text-sky-700' href={'/customer/login'}>login</Link></div>
    </div>
  )
}

export default page