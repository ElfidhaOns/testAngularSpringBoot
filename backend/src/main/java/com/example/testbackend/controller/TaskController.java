package com.example.testbackend.controller;

import com.example.testbackend.entity.Task;
import com.example.testbackend.entity.TaskStatus;
import com.example.testbackend.service.interfaces.TaskService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")

public class TaskController {
    TaskService taskService;
    @GetMapping("/tasks")
    public List<Task> getAll(@RequestParam(required = false) TaskStatus status) {
        return taskService.getAllTasks(status);
    }

    @GetMapping("/projects/{projectId}/tasks")
    public List<Task> getByProject(@PathVariable Long projectId) {
        return taskService.getTasksByProject(projectId);
    }

    @GetMapping("/tasks/{id}")
    public Task getById(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }
    @PostMapping("/projects/{projectId}/tasks")
    public Task create(@PathVariable Long projectId,
                       @Valid @RequestBody Task task) {
        return taskService.createTask(projectId, task);
    }


    @PutMapping("/tasks/{id}")
    public Task update(@PathVariable Long id,
                       @Valid @RequestBody Task task) {
        return taskService.updateTask(id, task);
    }

    @DeleteMapping("/tasks/{id}")
    public void delete(@PathVariable Long id) {
        taskService.deleteTask(id);
    }
}