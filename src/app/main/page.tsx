"use client";

import { useWeb3StatusStore } from "@/src/store/web3StatusStore";

export default function MainPage() {
  const { metamaskInstalled } = useWeb3StatusStore();

  if (!metamaskInstalled) {
    alert("please install metaMask");
    return <div className="text-red-500">metaMask is not installed</div>;
  }

  return <div className="text-green-500">metaMask is installed</div>;
}
