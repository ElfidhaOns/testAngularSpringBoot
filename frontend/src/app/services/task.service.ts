import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }
  
  // Corrected endpoint to match backend: /api/projects/{projectId}/tasks
  getTasksByProject(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/projects/${projectId}/tasks`);
  }

  // Corrected endpoint to match backend: /api/projects/{projectId}/tasks
  createTask(projectId: number, task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/projects/${projectId}/tasks`, task);
  }

  // This is correct: /api/tasks/{id}
  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${id}`, task);
  }

  // This is correct: /api/tasks/{id}
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${id}`);
  }
  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/tasks/${id}`);
  }
  // Optional: Add method to get all tasks (if needed)
  getAllTasks(status?: string): Observable<Task[]> {
    let url = `${this.apiUrl}/tasks`;
    if (status) {
      url += `?status=${status}`;
    }
    return this.http.get<Task[]>(url);
  }
    getTasksByProjectByStatus(projectId: number, status?: string): Observable<Task[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<Task[]>(`${this.apiUrl}/project/${projectId}`, { params });
  }
}