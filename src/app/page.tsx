"use client";
import { useEffect, useState } from "react";
import Web3 from "web3";

export default function Home() {
  const web3 = new Web3(
    new Web3.providers.HttpProvider("http://localhost:8545")
  );
  const [accounts, setAccounts] = useState<string[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [balance, setBalance] = useState<string>("");

  useEffect(() => {
    const loadAccounts = async () => {
      const accounts = await web3.eth.getAccounts();
      setAccounts(accounts);
    };

    loadAccounts().catch(console.error);
  }, []);

  const handleAccountClick = async (account: string) => {
    const weiBalance = await web3.eth.getBalance(account);
    const ethBalance = Web3.utils.fromWei(weiBalance, "ether");
    setBalance(ethBalance);
    setSelectedAccount(account);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col gap-4">
        {accounts.map((account) => (
          <>
            <button
              onClick={() => handleAccountClick(account)}
              key={account}
              className="w-fit bg-blue-500 text-white p-2 rounded-md"
            >
              {selectedAccount === account ? account : account.slice(0, 6)}...
              {account.slice(-4)}
            </button>
            {selectedAccount === account && (
              <span className="text-xs text-gray-500">({balance} ETH)</span>
            )}
          </>
        ))}
      </div>
    </div>
  );
}
