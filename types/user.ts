export interface UserDashboard {
    user: UserSummary;
    total_accounts: number;
    accounts_with_issue: number;
    total_shares: number;
    failed_shares: number;
    failed_applications: FailedApplication[];
}

export interface UserSummary {
    first_name: string;
    last_name: string;
}

export interface FailedApplication {
    account_id: string;
    account_name: string;
    share_id: string;
    scrip: string;
    error_message: string;
    created_at: string;
}