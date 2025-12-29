"use client";

import { Suspense } from "react";
import Web3Initializer from "../components/common/Web3Initializer";

export default function RootPage() {
  return (
    <Suspense fallback={null}>
      <Web3Initializer />
    </Suspense>
  );
}
