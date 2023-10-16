export interface Account {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    role: string;
    risk_percentage: number | null;
  };
  website: string;
  bookie: string;
  referral: string;
  username: string;
  password: string;
  ip_location: string;
  credit_line: number;
  max_win: number;
  weeklyFigures: Array<{
    id: string;
    account_id: string;
    amount: number;
    transaction_date: string;
    week_start: string;
    stiffed: boolean;
    adjustments: Array<{
      id: string;
      figure_id: string;
      amount: number;
      operation: string;
      date: string;
    }>
  }>;
}

export interface UserAccounts {
  username: string;
  risk: number;
  accounts: Account[];
}
export const USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  signDisplay: 'always',
});

export const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Los_Angeles'
})