export interface Task {
    id?: number;
    title: string;
    status: string;
    dueDate: string;
    projectId?: number;
}
