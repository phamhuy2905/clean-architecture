import { injectable } from 'inversify';
import User from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';

/**
 * In-memory implementation of user repository
 * Used for testing and development
 */
@injectable()
export class InMemoryUserRepository implements IUserRepository {
    private users: User[] = [];

    async create(user: User): Promise<User> {
        this.users.push(user);
        return user;
    }

    async findById(id: string): Promise<User | null> {
        const user = this.users.find(u => u.getId() === id);
        return user || null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = this.users.find(u => u.getEmail() === email);
        return user || null;
    }

    async update(user: User): Promise<void> {
        const index = this.users.findIndex(u => u.getId() === user.getId());
        if (index !== -1) {
            this.users[index] = user;
        }
    }

    async delete(id: string): Promise<void> {
        const index = this.users.findIndex(u => u.getId() === id);
        if (index !== -1) {
            this.users.splice(index, 1);
        }
    }

    async findAll(): Promise<User[]> {
        return [...this.users];
    }

    // Utility methods for testing
    async clear(): Promise<void> {
        this.users = [];
    }

    async count(): Promise<number> {
        return this.users.length;
    }
}
