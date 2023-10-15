import { Account, UserAccounts } from "@/types/types";

export const groupAccountsByUser = (accounts: Account[]): UserAccounts[] => {
  const grouped: { [userId: string]: Account[] } = {};

  accounts.forEach((account) => {
    const username = account.user.username;

    if (!grouped[username]) {
      grouped[username] = [];
    }

    grouped[username].push(account);
  });

  const userAccountsArray: UserAccounts[] = Object.keys(grouped).map((username) => ({
    username,
    risk: grouped[username][0].user.risk_percentage!,
    accounts: grouped[username],
  }));

  return userAccountsArray;
}