'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ReRoute = () => {
    const router = useRouter()

    useEffect(() => {
        router.push('/manager/bookings')
    //@ts-ignore
    }, [])

    return (
        <h1 className='text-secondary text-2xl font-bold text-center motion-preset-typewriter-[14]'>Redirecting...</h1>
    )

}

export default ReRoute