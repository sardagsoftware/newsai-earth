"use client";
import React, { useEffect, useState } from "react";
import SearchResults from "./SearchResults";

export default function ResultsHost() {
  const [results, setResults] = useState<unknown[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
  const ce = e as CustomEvent;
  setResults((ce.detail as unknown as unknown[]) ?? []);
    };
    window.addEventListener("newsai:results", handler as EventListener);
    return () => window.removeEventListener("newsai:results", handler as EventListener);
  }, []);

  return <SearchResults results={results} />;
}
