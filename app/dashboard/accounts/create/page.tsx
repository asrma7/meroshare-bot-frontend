'use client';

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAccountApi } from '@/api/account'
import AccountForm from '@/components/account/account-form'
import { CreateAccountFormValues } from '@/types/account';

export default function CreateAccountPage() {
    const { createAccount } = useAccountApi()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = React.useState(false)

    const handleSubmit = async (values: CreateAccountFormValues) => {
        try {
            setIsLoading(true)
            await createAccount(values)
            router.push('/dashboard/accounts')
        } catch (err) {
            console.error('Error creating account:', err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl space-y-4">
            <h1 className="text-xl font-semibold">Add Account</h1>
            <AccountForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
    )
}