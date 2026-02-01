package com.example.testbackend.service.interfaces;

import com.example.testbackend.entity.Task;
import com.example.testbackend.entity.TaskStatus;

import java.util.List;

public interface TaskService {

    List<Task> getAllTasks(TaskStatus status);
    Task getTaskById(Long id);
    List<Task> getTasksByProject(Long projectId);

    Task createTask(Long projectId, Task task);

    Task updateTask(Long id, Task task);

    void deleteTask(Long id);
}
