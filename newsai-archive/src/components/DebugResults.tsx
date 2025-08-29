"use client";
import React from "react";

export default function DebugResults({ data }: { data: unknown }) {
  return (
    <div className="mt-4 p-3 bg-black bg-opacity-40 rounded-md text-sm font-mono max-h-64 overflow-auto">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
