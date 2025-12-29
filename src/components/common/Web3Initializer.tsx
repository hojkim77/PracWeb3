"use client";

import { initializeWeb3 } from "@/src/lib/web3";
import { isLocalEnvironment } from "@/src/utils/environment";
import { useRouter } from "next/navigation";
import { use, useMemo, useEffect } from "react";

const Web3Initializer = () => {
  const router = useRouter();

  const createInitPromise = () => {
    return new Promise<void>((resolve, reject) => {
      const init = async () => {
        try {
          const isLocal = isLocalEnvironment();

          if (isLocal) {
            await initializeWeb3(false, "http://localhost:8545");
          } else {
            try {
              await initializeWeb3(true);
            } catch {
              await initializeWeb3(false);
            }
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      init();
    });
  };

  const initPromise = useMemo(() => createInitPromise(), []);

  use(initPromise);

  useEffect(() => {
    const isLocal = isLocalEnvironment();
    router.replace(isLocal ? "/local" : "/main");
  }, [router]);

  return null;
};

export default Web3Initializer;
