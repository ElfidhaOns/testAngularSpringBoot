import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';
declare var bootstrap: any;

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  projectId!: number;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // récupérer l'ID du projet depuis l'URL
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTasks();
  }

  // Charger toutes les tâches du projet
  loadTasks(): void {
    this.taskService.getTasksByProject(this.projectId)
      .subscribe({
        next: (data) => this.tasks = data,
        error: (err) => console.error('Erreur chargement tâches', err)
      });
  }
taskToDelete?: Task;

// Remplacer l'ancien confirmDelete
confirmDelete(task: Task): void {
  this.taskToDelete = task;
  // afficher la modal
  const modalEl = document.getElementById('deleteModal');
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
}

// Fermer la modal
closeModal(): void {
  const modalEl = document.getElementById('deleteModal');
  if (modalEl) {
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal?.hide();
  }
  this.taskToDelete = undefined;
}

// Quand on confirme la suppression
deleteConfirmed(): void {
  if (!this.taskToDelete) return;

  this.taskService.deleteTask(this.taskToDelete.id!).subscribe({
    next: () => {
      this.tasks = this.tasks.filter(t => t.id !== this.taskToDelete!.id);
      this.closeModal();
    },
    error: (err) => console.error('Erreur suppression tâche', err)
  });
}


  // Rediriger vers le formulaire de modification
  editTask(task: Task): void {
    this.router.navigate(['/projects', this.projectId, 'tasks', task.id, 'edit']);
  }

  // Ajouter une nouvelle tâche
  addTask(): void {
    this.router.navigate(['/projects', this.projectId, 'tasks', 'new']);
  }
}
