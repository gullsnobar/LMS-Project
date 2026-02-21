"use client"
import React, { FC, ReactNode, useState, useEffect } from 'react'
import { useLoadUserQuery } from '@/redux/features/api/apiSlice'
import Loader from './Loader/Loader'

type Props = {
    children: ReactNode
}

const Custom: FC<Props> = ({ children }) => {
    const [mounted, setMounted] = useState(false)
    const { isLoading } = useLoadUserQuery()
    
    useEffect(() => {
        setMounted(true)
    }, [])
    
    // Don't render anything until mounted to avoid hydration mismatch
    if (!mounted) {
        return null
    }
    
    return (
        <>
            {isLoading ? <Loader /> : <>{children}</>}
        </>
    )
}

export default Custom
