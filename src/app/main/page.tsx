"use client";

import { getWeb3, hasWeb3 } from "@/src/lib/web3";
import { useWeb3StatusStore } from "@/src/store/web3StatusStore";
import { useEffect } from "react";

export default function MainPage() {
  const { metamaskInstalled } = useWeb3StatusStore();

  useEffect(() => {
    const getAccounts = async () => {
      if (!hasWeb3()) {
        alert("please install metaMask");
        return;
      }
      const accounts = await getWeb3().eth.getAccounts();

      // FIXME
      console.log(accounts);
    };

    getAccounts();
  }, []);

  if (!metamaskInstalled) {
    return <div className="text-red-500">metaMask is not installed</div>;
  }

  return <div className="text-green-500">metaMask is installed</div>;
}
