// src/services/supabase/cardsService.ts

import { supabase } from "@/services/supabase/client";
import { Card } from "@/types/cards";

function mapRow(row: any): Card {
  return {
    id: row.id,
    userId: row.user_id,
    pokemonName: row.pokemon_name,
    collectionName: row.collection_name,
    cardCode: row.card_code,
    language: row.language,
    condition: row.condition,
    quantity: row.quantity,
    paidPrice: row.paid_price,
    estimatedValue: row.estimated_value,
    imageUrl: row.image_url,
    createdAt: row.created_at,
  };
}

export async function getCards(): Promise<Card[]> {
  const { data, error } = await supabase.from("cards").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function createCard(card: Omit<Card, "id" | "userId" | "createdAt">): Promise<Card> {
  const { data, error } = await supabase
    .from("cards")
    .insert({
      pokemon_name: card.pokemonName,
      collection_name: card.collectionName,
      card_code: card.cardCode,
      language: card.language,
      condition: card.condition,
      quantity: card.quantity,
      paid_price: card.paidPrice,
      estimated_value: card.estimatedValue,
      image_url: card.imageUrl,
    })
    .select()
    .single();
  if (error) throw error;
  return mapRow(data);
}

export async function updateCard(id: string, card: Partial<Card>): Promise<void> {
  const { error } = await supabase
    .from("cards")
    .update({
      pokemon_name: card.pokemonName,
      collection_name: card.collectionName,
      card_code: card.cardCode,
      language: card.language,
      condition: card.condition,
      quantity: card.quantity,
      paid_price: card.paidPrice,
      estimated_value: card.estimatedValue,
      image_url: card.imageUrl,
    })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteCard(id: string): Promise<void> {
  const { error } = await supabase.from("cards").delete().eq("id", id);
  if (error) throw error;
}

export async function getCardById(id: string): Promise<Card> {
  const { data, error } = await supabase.from("cards").select("*").eq("id", id).single();
  if (error) throw error;
  return mapRow(data);
}

export async function updateQuantity(id: string, quantity: number): Promise<void> {
  const { error } = await supabase.from("cards").update({ quantity }).eq("id", id);
  if (error) throw error;
}