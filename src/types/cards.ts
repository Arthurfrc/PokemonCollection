// src/types/card.ts

export type CardCondition = "N" | "SP" | "MP" | "HP" | "NM";

export interface Card {
  id: string;
  userId: string | null;
  pokemonName: string;
  collectionName: string;
  cardCode: string;
  language: string;
  condition: CardCondition;
  quantity: number;
  paidPrice: number | null;
  estimatedValue: number | null;
  imageUrl: string | null;
  createdAt: string;
}