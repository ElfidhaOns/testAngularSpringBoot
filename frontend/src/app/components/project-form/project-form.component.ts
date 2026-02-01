import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/models/project';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {

  projectForm!: FormGroup;
  projectId?: number;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // récupérer l'id si existe
    this.projectId = this.route.snapshot.paramMap.get('id')
      ? Number(this.route.snapshot.paramMap.get('id'))
      : undefined;

    this.isEdit = !!this.projectId;

    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.maxLength(20)]]
    });

    // MODE MODIFICATION → charger le projet
    if (this.isEdit && this.projectId) {
      this.projectService.getProjectById(this.projectId).subscribe({
        next: (project: Project) => {
          this.projectForm.patchValue(project);
        },
        error: err => console.error('Erreur chargement projet', err)
      });
    }
  }

  get f() {
    return this.projectForm.controls;
  }

  submit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    const projectData: Project = this.projectForm.value;

    if (this.isEdit && this.projectId) {
      // ✏️ UPDATE
      this.projectService.updateProject(this.projectId, projectData).subscribe(() => {
        this.router.navigate(['/projects']);
      });
    } else {
      // ➕ CREATE
      this.projectService.createProject(projectData).subscribe(() => {
        this.router.navigate(['/projects']);
      });
    }
  }
}
