import CategoryFormat from "./CategoryFormat";

export interface CountdownFormat {
    id: number;
    title: string;
    description: string;
    dueDate: Date;
    category: CategoryFormat;
    isArchived: boolean;
}
