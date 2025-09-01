'use client';

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAccountApi } from '@/api/account'
import AccountForm from '@/components/account/account-form'
import { AccountFormValues } from '@/types/account';
import { toast } from 'sonner';

export default function CreateAccountPage() {
    const { createAccount } = useAccountApi()
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)

    const handleSubmit = async (values: AccountFormValues) => {
        try {
            setIsLoading(true)
            const resp = await createAccount(values)
            if (resp.status === 'success') {
                toast.success(resp.message || 'Account created successfully.')
                router.push('/dashboard/accounts')
            } else {
                toast.error(resp.message || 'Something went wrong.')
            }
        } catch (err) {
            console.error('Error creating account:', err)
            toast.error('Something went wrong.')
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