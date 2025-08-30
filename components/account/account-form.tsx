'use client'

import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardFooter
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import useCapitalOptionsHandler from '@/hooks/useCapitalOptionsHandler'
import Loading from '../ui/loading'
import { ChevronsUpDown } from 'lucide-react'
import { AccountFormValues } from '@/types/account'

type Props = {
    onSubmit: (values: AccountFormValues) => Promise<void>
    initialValues?: AccountFormValues
    isLoading: boolean
}

export default function AccountForm({
    onSubmit,
    initialValues,
    isLoading,
}: Props) {

    const [clientId, setClientId] = useState<string | null>(initialValues?.client_id || null)
    const [clientIdOpen, setClientIdOpen] = React.useState(false)
    const [userBankOptions, setUserBankOptions] = useState<{ value: string; label: string }[]>([])
    const [bankId, setBankId] = useState<string | null>(initialValues?.bank_id || null)
    const [bankOpen, setBankOpen] = React.useState(false)
    const [username, setUsername] = useState<string>(initialValues?.username || '')
    const [password, setPassword] = useState<string>('')
    const [isDetailsVisible, setIsDetailsVisible] = useState<boolean>(false)
    const [crnNumber, setCrnNumber] = useState<string>(initialValues?.crn_number || '')
    const [transactionPIN, setTransactionPIN] = useState<string>('')
    const [preferredKitta, setPreferredKitta] = useState<number>(initialValues?.preferred_kitta || 10)
    const [error, setError] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState<boolean>(false)

    const { capitalOptions, isCapitalOptionsLoading } = useCapitalOptionsHandler()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsProcessing(true)
        if (!isDetailsVisible) {
            if (!clientId) {
                setError('Please select a capital.')
                setIsProcessing(false)
                return
            }
            if (!username) {
                setError('Please enter a username.')
                setIsProcessing(false)
                return
            }
            if (!password) {
                setError('Please enter a password.')
                setIsProcessing(false)
                return
            }
            let response = await fetch('https://webbackend.cdsc.com.np/api/meroShare/auth/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clientId,
                    username,
                    password
                })
            })
            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/xml")) {
                    const text = await response.text();
                    const parser = new DOMParser();
                    const xml = parser.parseFromString(text, "application/xml");
                    const message = xml.getElementsByTagName("message")[0]?.textContent;
                    setError(message || 'Something went wrong.')
                } else {
                    setError('Something went wrong.')
                }
                setIsProcessing(false)
                return
            } else {
                const authHeader = response.headers.get("Authorization");
                if (authHeader) {
                    let bankResponse = await fetch('https://webbackend.cdsc.com.np/api/meroShare/bank/', {
                        headers: {
                            'Authorization': authHeader
                        }
                    })
                    let userBanks = await bankResponse.json()
                    setUserBankOptions(userBanks.map((bank: { id: number; name: string }) => ({
                        label: bank.name,
                        value: bank.id.toString()
                    })))
                    setIsDetailsVisible(true)
                    setIsProcessing(false)
                } else {
                    setError('Authorization failed.')
                    setIsProcessing(false)
                }
            }
        } else {
            if (!bankId) {
                setError('Please select a bank.')
                setIsProcessing(false)
                return
            }
            if (!crnNumber) {
                setError('Please enter a CRN number.')
                setIsProcessing(false)
                return
            }
            if (!transactionPIN) {
                setError('Please enter an account pin.')
                setIsProcessing(false)
                return
            }
            if (isNaN(Number(transactionPIN))) {
                setError('Transaction PIN must be a number.')
                setIsProcessing(false)
                return
            }
            if (preferredKitta < 10) {
                setError('Preferred Kitta must be at least 10.')
                setIsProcessing(false)
                return
            }
            await onSubmit({
                client_id: clientId,
                username,
                password,
                bank_id: bankId,
                crn_number: crnNumber,
                transaction_pin: transactionPIN,
                preferred_kitta: preferredKitta
            })
            setIsProcessing(false)
        }
    }

    if (isCapitalOptionsLoading) {
        return <Loading />
    }

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardContent className="space-y-6 py-6">
                    {error && <div className="text-red-500">{error}</div>}
                    {(isDetailsVisible && userBankOptions.length !== 0) ? (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor='bank'>Bank</Label>
                                <Popover open={bankOpen} onOpenChange={setBankOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            id='bank'
                                            aria-expanded={bankOpen}
                                            className="w-full justify-between"
                                        >
                                            {bankId
                                                ? userBankOptions.find((option) => option.value === bankId)?.label
                                                : "Select bank..."}
                                            <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className='w-full'>
                                        <Command>
                                            <CommandInput placeholder="Search bank..." />
                                            <CommandList>
                                                <CommandEmpty>No bank found.</CommandEmpty>
                                                <CommandGroup>
                                                    {userBankOptions.map((option) => (
                                                        <CommandItem key={option.value} onSelect={() => { setBankId(option.value); setBankOpen(false); }}>
                                                            {option.label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor='crnNumber'>CRN Number</Label>
                                <Input id='crnNumber' name='crn' value={crnNumber} onChange={(e) => setCrnNumber(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor='accountPin'>Account Pin</Label>
                                <Input id='accountPin' name='pin' value={transactionPIN} onChange={(e) => setTransactionPIN(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor='preferredKitta'>Preferred Kitta</Label>
                                <Input id='preferredKitta' name='kitta' type='number' value={preferredKitta} min={10} onChange={(e) => setPreferredKitta(Number(e.target.value))} />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <label htmlFor='capital'>Capital</label>
                                <Popover open={clientIdOpen} onOpenChange={setClientIdOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            id='capital'
                                            aria-expanded={clientIdOpen}
                                            role="combobox"
                                            className="w-full justify-between"
                                        >
                                            {clientId
                                                ? capitalOptions.find((option) => option.value === clientId)?.label
                                                : "Select Capital..."}
                                            <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className='w-full'>
                                        <Command>
                                            <CommandInput placeholder="Search capital..." />
                                            <CommandList>
                                                <CommandEmpty>No capital found.</CommandEmpty>
                                                <CommandGroup>
                                                    {capitalOptions.map((option) => (
                                                        <CommandItem key={option.value} onSelect={() => { setClientId(option.value); setClientIdOpen(false); }}>
                                                            {option.label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor='username'>Username</Label>
                                <Input id='username' name='username' value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor='password'>Password</Label>
                                <Input id='password' name='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </>
                    )}
                </CardContent>

                <CardFooter className="flex justify-end">
                    <Button type="submit" disabled={isLoading || isProcessing} className='cursor-pointer'>
                        {isDetailsVisible ? initialValues ? 'Update Account' : 'Add Account' : 'Continue'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}