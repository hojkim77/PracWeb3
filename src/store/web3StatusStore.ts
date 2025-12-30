import { create } from "zustand";

type Web3Status = "initializing" | "initialized" | "error";

interface Web3StatusStore {
  web3Status: Web3Status;
  metamaskInstalled: boolean;
  setWeb3Status: (status: Web3Status) => void;
  setMetamaskInstalled: (installed: boolean) => void;
}

export const useWeb3StatusStore = create<Web3StatusStore>()((set) => ({
  web3Status: "initializing",
  metamaskInstalled: false,
  setWeb3Status: (status: Web3Status) => set({ web3Status: status }),
  setMetamaskInstalled: (installed: boolean) =>
    set({ metamaskInstalled: installed }),
}));
