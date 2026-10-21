import { Injectable } from '@nestjs/common';
import * as os from 'os';

export interface Todo {
  id: number;
  title: string;
}

@Injectable()
export class AppService {
  // In-memory only: each pod has its own list and it is lost on restart
  private todos: Todo[] = [{ id: 1, title: 'Learn Kubernetes' }];

  getInfo() {
    return {
      message: process.env.APP_MESSAGE || 'Hello from NestJS',
      hostname: os.hostname(),
      environment: process.env.NODE_ENV || 'development',
      secretConfigured: !!process.env.APP_SECRET,
      time: new Date().toISOString(),
    };
  }

  getTodos() {
    return this.todos;
  }

  addTodo(title: string) {
    const todo = { id: Date.now(), title: title || 'untitled' };
    this.todos.push(todo);
    return todo;
  }
}
