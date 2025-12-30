import Web3 from "web3";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { isLocalEnvironment } from "../utils/environment";
import { useWeb3StatusStore } from "../store/web3StatusStore";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

let web3Instance: Web3 | null = null;

const getDefaultRpcUrl = (): string => {
  if (isLocalEnvironment()) {
    return "http://localhost:8545";
  } else {
    return "https://rpc.sepolia.org";
  }
};

export const initializeWeb3 = (
  useMetaMask?: boolean,
  rpcUrl?: string
): Promise<boolean> => {
  const { setWeb3Status, setMetamaskInstalled } = useWeb3StatusStore.getState();
  if (web3Instance) {
    setWeb3Status("initialized");
    return Promise.resolve(true);
  }
  const hasProvider = typeof window !== "undefined" && !!window.ethereum;
  const shouldUseMetaMask = useMetaMask ?? hasProvider;

  if (useMetaMask && !hasProvider) {
    setMetamaskInstalled(false);
    setWeb3Status("error");
    return Promise.resolve(false);
  }

  if (shouldUseMetaMask && hasProvider) {
    setMetamaskInstalled(true);
    web3Instance = new Web3(window.ethereum);
  } else {
    const getRpcUrl = () => {
      if (rpcUrl) {
        return rpcUrl;
      }

      if (typeof window !== "undefined") {
        return process.env.NEXT_PUBLIC_RPC_URL || getDefaultRpcUrl();
      }
      return process.env.RPC_URL || getDefaultRpcUrl();
    };

    web3Instance = new Web3(new Web3.providers.HttpProvider(getRpcUrl()));
  }

  setWeb3Status("initialized");
  return Promise.resolve(true);
};

export const getWeb3 = () => {
  if (!web3Instance) {
    // 초기화되지 않은 경우에도 HTTP Provider로 안전하게 생성
    const rpc =
      (typeof window !== "undefined" && process.env.NEXT_PUBLIC_RPC_URL) ||
      process.env.RPC_URL ||
      getDefaultRpcUrl();
    web3Instance = new Web3(new Web3.providers.HttpProvider(rpc));
  }

  return web3Instance;
};

export const resetWeb3 = (): void => {
  web3Instance = null;
};

const web3 = getWeb3();

export default web3;
