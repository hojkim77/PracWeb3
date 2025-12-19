"use client";
import { useEffect, useState } from "react";
import web3 from "../lib/web3";
import {
  useTransactionStore,
  TransactionInfo,
} from "../store/transactionStore";

export default function Home() {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [selectedFrom, setSelectedFrom] = useState<string>("");
  const [selectedTo, setSelectedTo] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [successedTransaction, setSuccessedTransaction] =
    useState<TransactionInfo>({
      from: "",
      to: "",
      amount: "",
      transactionHash: "",
    });

  const { transactions, addTransaction, clearTransactions } =
    useTransactionStore();

  useEffect(() => {
    const loadAccounts = async () => {
      const accounts = await web3.eth.getAccounts();
      setAccounts(accounts);
      // accounts가 로드되면 첫 번째 계정으로 초기화
      if (accounts.length > 0) {
        setSelectedFrom(accounts[0]);
        if (accounts.length > 1) {
          setSelectedTo(accounts[1]);
        } else {
          setSelectedTo(accounts[0]);
        }
      }
    };

    loadAccounts().catch(console.error);
  }, []);

  const handleFromChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFrom(event.currentTarget.value);
  };

  const handleToChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTo(event.currentTarget.value);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.currentTarget.value);
  };

  const handleSendTransaction = async () => {
    try {
      const transaction = await web3.eth.sendTransaction({
        from: selectedFrom,
        to: selectedTo,
        value: web3.utils.toWei(amount, "ether"),
      });
      const transactionInfo: TransactionInfo = {
        from: selectedFrom,
        to: selectedTo,
        amount: amount,
        transactionHash: transaction.transactionHash.toString(),
      };
      setSuccessedTransaction(transactionInfo);
      // Zustand store에 저장 (localStorage에 자동으로 저장됨)
      addTransaction(transactionInfo);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans dark:bg-black p-8 justify-between">
      <div className="flex flex-col gap-4 w-[40%]">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Send Transaction</h2>

          <select
            name="from"
            id="from"
            className="w-full p-2 rounded-md"
            value={selectedFrom}
            onChange={handleFromChange}
          >
            {accounts.map((account) => (
              <option key={account} value={account}>
                {account}
              </option>
            ))}
          </select>

          <select
            name="to"
            id="to"
            className="w-full p-2 rounded-md"
            value={selectedTo}
            onChange={handleToChange}
          >
            {accounts.map((account) => (
              <option key={account} value={account}>
                {account}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Amount"
            value={amount}
            onChange={handleAmountChange}
          />

          <button
            className="bg-blue-500 text-white p-2 rounded-md disabled:bg-gray-500 disabled:text-white"
            onClick={handleSendTransaction}
            disabled={selectedFrom === selectedTo || Number(amount) <= 0}
          >
            Send
          </button>

          <div className="flex flex-col gap-4 ">
            {successedTransaction.transactionHash && (
              <div className="flex flex-col gap-2 bg-green-400 text-white p-2 rounded-md ">
                <p className="max-w-full break-words">
                  From: {successedTransaction.from}
                </p>
                <p className="max-w-full break-words">
                  To: {successedTransaction.to}
                </p>
                <p className="max-w-full break-words">
                  Amount: {successedTransaction.amount}
                </p>
                <p className="max-w-full break-words">
                  Transaction Hash: {successedTransaction.transactionHash}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-[40%]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Transaction History</h2>
          {transactions.length > 0 && (
            <button
              onClick={clearTransactions}
              className="text-sm bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
            >
              Clear All
            </button>
          )}
        </div>
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions yet</p>
        ) : (
          <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto">
            {transactions
              .slice()
              .reverse()
              .map((tx, index) => (
                <div
                  key={`${tx.transactionHash}-${index}`}
                  className="flex flex-col gap-2 bg-gray-100 dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700"
                >
                  <p className="text-sm break-words">
                    <span className="font-semibold">From:</span> {tx.from}
                  </p>
                  <p className="text-sm break-words">
                    <span className="font-semibold">To:</span> {tx.to}
                  </p>
                  <p className="text-sm break-words">
                    <span className="font-semibold">Amount:</span> {tx.amount}{" "}
                    ETH
                  </p>
                  <p className="text-sm break-words">
                    <span className="font-semibold">Hash:</span>{" "}
                    {tx.transactionHash}
                  </p>
                  {tx.timestamp && (
                    <p className="text-xs text-gray-500">
                      {new Date(tx.timestamp).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
