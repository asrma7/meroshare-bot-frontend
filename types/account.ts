export interface AccountFormValues {
    client_id: string | null
    username: string
    password: string
    bank_id: string | null
    crn_number: string
    transaction_pin: string
    preferred_kitta: number
}

export interface Account {
    ID: string;
    Name: string;
    Email: string;
    Contact: string;
    ClientID: string | null;
    Username: string;
    BankID: string | null;
    CRNNumber: string;
    AccountTypeId: number | null;
    PreferredKitta: number;
    Demat: string;
    BOID: string;
    AccountNumber: string;
    CustomerId: number | null;
    AccountBranchId: number | null;
    DMATExpiryDate: string | null;
    ExpiredDate: string | null;
    PasswordExpiryDate: string | null;
    CreatedAt: string | null;
    UpdatedAt: string | null;
    Status: string | null;
}

