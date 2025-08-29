'use client';

import React, { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAccountApi } from '@/api/account'
import AccountForm from '@/components/account/account-form'
import { Account, AccountFormValues } from '@/types/account';
import Loading from '@/components/ui/loading';
import { toast } from 'sonner';

export default function CreateAccountPage() {
    const { id } = useParams()
    const { getAccountById, updateAccount } = useAccountApi()
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)
    const [account, setAccount] = React.useState<Account | null>(null)
    const [error, setError] = React.useState<string | null>(null)

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const data = await getAccountById(id!.toString())
                setAccount(data.account)
            } catch (err) {
                console.error('Error fetching account:', err)
            }
        }

        fetchAccount()
    }, [id, getAccountById])

    const handleSubmit = async (values: AccountFormValues) => {
        try {
            setIsLoading(true)
            let resp = await updateAccount(id!.toString(), values)
            if (resp.status === 'success') {
                toast.success(resp.message || 'Account updated successfully.')
                router.push('/dashboard/accounts')
            } else {
                toast.error(resp.message || 'Something went wrong.')
            }
        } catch (err) {
            toast.error('Something went wrong.')
        } finally {
            setIsLoading(false)
        }
    }

    if (!account) return <Loading />;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl space-y-4">
            <h1 className="text-xl font-semibold">Edit Account</h1>
            <AccountForm onSubmit={handleSubmit} isLoading={isLoading} initialValues={{
                client_id: account.ClientID,
                username: account.Username,
                password: '',
                bank_id: account.BankID,
                crn_number: account.CRNNumber,
                transaction_pin: '',
                preferred_kitta: account.PreferredKitta
            }} />
        </div>
    )
}