export const MOODS = [
  { value: "happy", emoji: "😊" },
  { value: "scared", emoji: "😨" },
  { value: "peaceful", emoji: "😌" },
  { value: "confused", emoji: "😕" },
  { value: "sad", emoji: "😢" },
  { value: "anxious", emoji: "😰" },
  { value: "magical", emoji: "✨" },
  { value: "exciting", emoji: "🎉" },
] as const;

export function getMoodEmoji(value: string | null): string {
  if (!value) return "";
  return MOODS.find((m) => m.value === value)?.emoji ?? "";
}
