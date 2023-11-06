import { Account, UserAccounts, BookieData } from "@/types/types";
import { User } from "@prisma/client";

export const groupAccountsByUser = (accounts: Account[]): UserAccounts[] => {
  const grouped: { [userId: string]: Account[] } = {};

  accounts.forEach((account) => {
    const username = account.user.username;

    if (!grouped[username]) {
      grouped[username] = [];
    }

    grouped[username].push(account);
  });

  const userAccountsArray: UserAccounts[] = Object.keys(grouped).map(
    (username) => ({
      username,
      name: grouped[username][0].user.name!,
      risk: grouped[username][0].user.risk_percentage!,
      gabe_way: grouped[username][0].user.gabe_way!,
      order: grouped[username][0].user.order!,
      accounts: grouped[username],
    })
  );

  return userAccountsArray;
};

export const groupAccountsByBookie = (
  userAccounts: UserAccounts[]
): BookieData[] => {
  const groupedData: { [key: string]: BookieData } = {};

  userAccounts.forEach((userAccount) => {
    userAccount.accounts.forEach((account) => {
      const compositeKey = `${account.bookie}_${account.website}`;
      const [name, website] = compositeKey.split("_");
      if (groupedData[name]) {
        const websiteExists = groupedData[name].websites.find(
          (w) => w.website === website
        );
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

export const sortUserAccountsByIds = (
  userAccounts: UserAccounts[],
  accountIds: string[]
): UserAccounts[] => {
  const sortedUserAccounts: UserAccounts[] = [];

  if (!accountIds || accountIds.length === 0) {
    return userAccounts;
  }

  for (const user of userAccounts) {
    const sortedAccounts: Account[] = [];

    const accountIdsSet = new Set(accountIds);
    const userAccountsMap = new Map<string, Account>();

    for (const account of user.accounts) {
      userAccountsMap.set(account.id, account);
    }

    for (const id of accountIds) {
      if (userAccountsMap.has(id)) {
        sortedAccounts.push(userAccountsMap.get(id)!);
        accountIdsSet.delete(id);
      }
    }

    for (const [id, account] of userAccountsMap) {
      if (accountIdsSet.has(id)) {
        sortedAccounts.push(account);
      }
    }

    const sortedUser: UserAccounts = { ...user, accounts: sortedAccounts };
    sortedUserAccounts.push(sortedUser);
  }
  return sortedUserAccounts;
};

export const sortAccountsByIds = (
  userAccounts: UserAccounts,
  accountIds: string[]
): UserAccounts => {
  if (!accountIds || accountIds.length === 0) {
    return userAccounts;
  }

  const sortedAccounts: Account[] = [];

  const accountIdsSet = new Set(accountIds);
  const userAccountsMap = new Map<string, Account>();

  for (const account of userAccounts.accounts) {
    userAccountsMap.set(account.id, account);
  }

  for (const id of accountIds) {
    if (userAccountsMap.has(id)) {
      sortedAccounts.push(userAccountsMap.get(id)!);
      accountIdsSet.delete(id);
    }
  }

  for (const [id, account] of userAccountsMap) {
    if (accountIdsSet.has(id)) {
      sortedAccounts.push(account);
    }
  }

  return { ...userAccounts, accounts: sortedAccounts };
};

export const sortAgentsById = (agents: any[], agentIds: string[]) => {
  const sortedObjects: User[] = [];
  const objectMap: { [key: string]: User } = {};

  for (const obj of agents) {
    objectMap[obj.id] = obj;
  }

  for (const id of agentIds) {
    if (objectMap.hasOwnProperty(id)) {
      sortedObjects.push(objectMap[id]);
      delete objectMap[id]; // Remove the object after it has been added to sortedObjects
    }
  }

  // Adding the remaining agents to the sorted list
  for (const id in objectMap) {
    sortedObjects.push(objectMap[id]);
  }

  return sortedObjects;
};
