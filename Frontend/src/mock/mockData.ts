import { CountdownFormat } from "../entity/CountdownFormat";

const mock_data: CountdownFormat[] = [
    {
        id: 1,
        title: "Task 1",
        description: "Description for Task 1",
        dueDate: new Date("2025-04-24T15:54:00Z"),
        category: "Work",
        isArchived: false,
    },
    {
        id: 2,
        title: "Task 2",
        description: "Description for Task 2",
        dueDate: new Date("2025-10-02T18:00:00Z"),
        category: "Personal",
        isArchived: false,
    },
    {
        id: 3,
        title: "Task 3",
        description: "Description for Task 3",
        dueDate: new Date("2025-10-03T12:00:00Z"),
        category: "Work",
        isArchived: false,
    },
    {
        id: 4,
        title: "Task 4",
        description: "Description for Task 4",
        dueDate: new Date("2025-10-04T12:00:00Z"),
        category: "Personal",
        isArchived: false,
    },
    {
        id: 5,
        title: "Task 5",
        description: "Description for Task 5",
        dueDate: new Date("2025-10-05T12:00:00Z"),
        category: "Work",
        isArchived: false,
    }
]

export { mock_data };