export interface ShareError {
    ID: string;
    UserID: string;
    AccountID: string;
    AppliedShareID: string;
    Message: string;
    Seen: boolean;
    CreatedAt: string;
    UpdatedAt: string;
}

export interface Share {
    ID: string;
    UserID: string;
    AccountID: string;
    CompanyName: string;
    CompanyShareID: number;
    Scrip: string;
    AppliedKitta: string;
    ShareGroupName: string;
    ShareTypeName: string;
    SubGroup: string;
    Status: string;
    CreatedAt: string;
    UpdatedAt: string;
}