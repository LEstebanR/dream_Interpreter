export type JournalEntry = {
  id: string;
  title: string | null;
  dreamText: string;
  interpretation: string | null;
  mood: string | null;
  tags: string[];
  createdAt: string;
};
