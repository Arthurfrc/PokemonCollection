// src/hooks/useCollectionStats.ts

import { useEffect, useState } from "react";
import { getCards } from "@/services/supabase/cardsService";
import { Card } from "@/types/card";

export interface CollectionStats {
  totalCards: number;
  totalValue: number;
  byCollection: { name: string; count: number }[];
  topValueCards: Card[];
}

export function useCollectionStats() {
  const [stats, setStats] = useState<CollectionStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCards().then((cards) => {
      const totalCards = cards.reduce((sum, c) => sum + c.quantity, 0);
      const totalValue = cards.reduce((sum, c) => sum + (c.estimatedValue ?? 0) * c.quantity, 0);

      const grouped = new Map<string, number>();
      cards.forEach((c) => grouped.set(c.collectionName, (grouped.get(c.collectionName) ?? 0) + c.quantity));
      const byCollection = Array.from(grouped.entries()).map(([name, count]) => ({ name, count }));

      const topValueCards = [...cards].sort((a, b) => (b.estimatedValue ?? 0) - (a.estimatedValue ?? 0)).slice(0, 5);

      setStats({ totalCards, totalValue, byCollection, topValueCards });
    }).finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}