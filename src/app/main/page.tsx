"use client";

import { useWeb3StatusStore } from "@/src/store/web3StatusStore";
import { useEffect } from "react";

export default function MainPage() {
  const { metamaskInstalled } = useWeb3StatusStore();

  useEffect(() => {
    if (!metamaskInstalled) {
      alert("please install metaMask");
    }
  }, [metamaskInstalled]);

  if (!metamaskInstalled) {
    return <div className="text-red-500">metaMask is not installed</div>;
  }

  return <div className="text-green-500">metaMask is installed</div>;
}
