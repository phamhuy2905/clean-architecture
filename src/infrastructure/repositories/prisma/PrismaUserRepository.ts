import { injectable } from 'inversify';
import User from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";

class PrismaClient {
}

@injectable()
export class PrismaUserRepository implements IUserRepository {
    private prisma: any;

    constructor() {
        this.prisma = new PrismaClient();
    }

    create(user: User): Promise<User> {
        return Promise.resolve(user); // Simulating Prisma create operation
    }

    findById(id: string): Promise<User | null> {
        // simulate user db
        const user = new User('1', 'John Doe', 'john.doe@example.com', 'testPassword');
        return Promise.resolve(user);
    }

    findAll(): Promise<User[]> {
        return this.prisma.user.findMany();
    }

    findByEmail(email: string): Promise<User | null> {
        return Promise.resolve(null);
    }

    update(user: User): Promise<void> {
        return this.prisma.user.update(user);
    }

    delete(id: string): Promise<void> {
        return this.prisma.user.delete({ where: { id } });
    }
}