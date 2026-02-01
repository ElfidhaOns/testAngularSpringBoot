import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project.service';
declare var bootstrap: any;

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})

export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  projectToDelete: any; // projet à supprimer
  deleteModal: any;
  

  constructor(private projectService: ProjectService, private router: Router) {}

  ngOnInit(): void {
    this.loadProjects();
    // Initialisation du modal
    const modalElement = document.getElementById('deleteModal');
    this.deleteModal = new bootstrap.Modal(modalElement);
  }

  loadProjects() {
    this.projectService.getProjects().subscribe(data => {
      this.projects = data;
    });
  }



  openDeleteModal(project: any) {
    this.projectToDelete = project;
    this.deleteModal.show();
  }

  deleteProject() {
    if (!this.projectToDelete) return;
    this.projectService.deleteProject(this.projectToDelete.id).subscribe(() => {
      this.loadProjects();
      this.deleteModal.hide();
      this.projectToDelete = null;
    });
  }
}