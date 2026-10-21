import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todosRepository: Repository<Todo>,
  ) {}

  findAll() {
    return this.todosRepository.find({ order: { createdAt: 'DESC' } });
  }

  create(dto: CreateTodoDto) {
    return this.todosRepository.save(this.todosRepository.create(dto));
  }

  async update(id: number, dto: UpdateTodoDto) {
    const todo = await this.todosRepository.findOneBy({ id });
    if (!todo) throw new NotFoundException(`Todo ${id} not found`);
    return this.todosRepository.save({ ...todo, ...dto });
  }

  async remove(id: number) {
    const result = await this.todosRepository.delete(id);
    if (!result.affected) throw new NotFoundException(`Todo ${id} not found`);
  }
}
