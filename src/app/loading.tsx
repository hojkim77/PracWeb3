"use client";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
        <p className="text-gray-700 dark:text-gray-200">Initializing Web3...</p>
      </div>
    </div>
  );
}

