// src/utils/cardCode.ts

function toIntPart(part: string): number | null {
  const cleaned = part.trim();
  if (!cleaned || !/^\d+$/.test(cleaned)) return null;
  return parseInt(cleaned, 10);
}

export function cardCodeMatches(storedCode: string, query: string): boolean {
  const storedParts = storedCode.split("/").map((p) => p.trim());
  const queryParts = query.split("/").map((p) => p.trim());

  // Usuário digitou só o número (ex: "5") -> compara apenas com o numerador
  // Usuário digitou "5/101" -> compara numerador E denominador exatos
  for (let i = 0; i < queryParts.length; i++) {
    const queryPart = queryParts[i];
    const storedPart = storedParts[i];
    if (storedPart === undefined) return false;

    const queryNum = toIntPart(queryPart);
    const storedNum = toIntPart(storedPart);

    if (queryNum !== null && storedNum !== null) {
      if (queryNum !== storedNum) return false; // 5 !== 15, mas 5 === 05
    } else {
      if (storedPart.toLowerCase() !== queryPart.toLowerCase()) return false;
    }
  }
  return true;
}