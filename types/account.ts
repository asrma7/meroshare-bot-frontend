export interface CreateAccountFormValues {
    client_id: string | null
    username: string
    password: string
    bank_id: number | null
    crn_number: string
    transaction_pin: string
    preferred_kitta: number
}
