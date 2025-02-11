export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  twigs: number;
  difficulty: "Easy" | "Medium" | "Hard";
  image: string;
}

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Go to library",
    description: "Go to library",
    category: "Category 1",
    twigs: 10,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80",
  },
  // Add more mock tasks as needed
];
