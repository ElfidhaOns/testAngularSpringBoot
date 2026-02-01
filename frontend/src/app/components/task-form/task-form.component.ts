import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/models/task';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  projectId!: number;
  taskId?: number;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('projectId'));
    this.taskId = this.route.snapshot.paramMap.get('taskId') 
                  ? Number(this.route.snapshot.paramMap.get('taskId')) 
                  : undefined;
    this.isEdit = !!this.taskId;

    // Formulaire avec validateur custom pour date future
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      status: ['', Validators.required],
      dueDate: ['', [Validators.required, this.futureDateValidator]]
    });

    // Si édition, charger la tâche
    if (this.isEdit && this.taskId) {
      this.taskService.getTaskById(this.taskId).subscribe({
        next: t => this.taskForm.patchValue(t),
        error: err => console.error('Erreur chargement tâche', err)
      });
    }
  }

  get f() { return this.taskForm.controls; }

  // Validateur simple pour date future
  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const today = new Date();
    const selectedDate = new Date(control.value);
    return selectedDate < today ? { futureDate: true } : null;
  }

  submit(): void {
    if (this.taskForm.invalid) return;

    const taskData: Task = {
      title: this.f['title'].value,
      status: this.f['status'].value,
      dueDate: this.f['dueDate'].value,
      projectId: this.projectId
    };

    if (this.isEdit && this.taskId) {
      this.taskService.updateTask(this.taskId, taskData).subscribe({
        next: () => this.router.navigate(['/projects', this.projectId, 'tasks']),
        error: err => console.error('Erreur mise à jour tâche', err)
      });
    } else {
      this.taskService.createTask(this.projectId, taskData).subscribe({
        next: () => this.router.navigate(['/projects', this.projectId, 'tasks']),
        error: err => console.error('Erreur création tâche', err)
      });
    }
  }
}
