import { Account, UserAccounts, BookieData } from "@/types/types";

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
    gabe_way: grouped[username][0].user.gabe_way!,
    accounts: grouped[username],
  }));

  return userAccountsArray;
}

export const groupAccountsByBookie = (userAccounts: UserAccounts[]): BookieData[] => {
  const groupedData: { [key: string]: BookieData } = {};

  userAccounts.forEach((userAccount) => {
    userAccount.accounts.forEach((account) => {
      const compositeKey = `${account.bookie}_${account.website}`;
      const [name, website] = compositeKey.split('_');
      if (groupedData[name]) {
        const websiteExists = groupedData[name].websites.find((w) => w.website === website);
        if (websiteExists) {
          websiteExists.accounts.push(account);
        } else {
          groupedData[name].websites.push({ website, accounts: [account] });
        }
      } else {
        groupedData[name] = {
          name,
          websites: [{ website, accounts: [account] }],
        };
      }
    });
  });

  return Object.values(groupedData);
};