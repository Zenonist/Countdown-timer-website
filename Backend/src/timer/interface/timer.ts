export interface Timer {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  category: string;
  isArchived: boolean;
}
