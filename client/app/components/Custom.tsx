"use client"
import React, { FC, ReactNode } from 'react'
import { useLoadUserQuery } from '@/redux/features/api/apiSlice'
import Loader from './Loader/Loader'

type Props = {
    children: ReactNode
}

const Custom: FC<Props> = ({ children }) => {
    const { isLoading } = useLoadUserQuery()
    return (
        <>
            {isLoading ? <Loader /> : <>{children}</>}
        </>
    )
}

export default Custom
