export type TaskStatus = "inbox" | "next" | "project" | "done";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  context?: string;
  projectId?: string;
  createdAt: number;
}
