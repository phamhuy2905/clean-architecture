# Clean Architecture TypeScript Project

A well-structured TypeScript application implementing Clean Architecture principles with Dependency Injection, following SOLID principles and best practices.

## 🏗️ Architecture Overview

This project follows **Clean Architecture** by Robert C. Martin (Uncle Bob), ensuring:

- **Independence** of frameworks, UI, database, and external agencies
- **Testability** with business rules testable without UI, database, web server, or external elements
- **Independence** of UI, database, and external agencies

## 🎯 Why Clean Architecture?

### **Core Benefits:**

1. **🔄 Maintainability** - Changes in one layer don't affect others
2. **🧪 Testability** - Business logic can be tested without external dependencies
3. **🔧 Flexibility** - Easy to swap implementations (database, framework, UI)
4. **👥 Team Collaboration** - Clear boundaries for different teams/developers
5. **📈 Scalability** - Architecture supports growth and complexity
6. **🛡️ Risk Reduction** - Isolates business logic from volatile external concerns

### **Real-World Problems It Solves:**

- **Framework Lock-in**: Switch from Express to Fastify without touching business logic
- **Database Migration**: Move from PostgreSQL to MongoDB without changing use cases
- **UI Changes**: Support both REST API and GraphQL with same business rules
- **Testing Complexity**: Test business logic without starting servers or databases
- **Team Dependencies**: Frontend/Backend teams can work independently

## 📋 Layer Detailed Explanation

### 1. 🏛️ **Domain Layer (Core/Innermost)**

**Purpose**: Contains enterprise-wide business rules and entities

**What it includes:**
- **Entities**: Core business objects with business rules
- **Value Objects**: Immutable objects representing business concepts
- **Domain Services**: Business logic that doesn't belong to a single entity
- **Repository Interfaces**: Contracts for data access (not implementation)

**Why this layer exists:**
```typescript
// Example: User entity with business rules
export default class User extends Base {
    // Business rule: User can only be blocked, not deleted
    public block(): void {
        this.isBlock = true;
    }
    
    // Business rule: Password comparison logic
    public comparePassword(password: string): boolean {
        return this.password === password;
    }
}
```

**Key principles:**
- ✅ **No dependencies** on external frameworks or libraries
- ✅ **Stable** - changes least frequently
- ✅ **Reusable** across different applications
- ✅ **Testable** without any external setup

### 2. 🎯 **Application Layer (Use Cases)**

**Purpose**: Contains application-specific business rules and orchestrates domain entities

**What it includes:**
- **Use Cases**: Application-specific business flows
- **Application Services**: Coordinate multiple domain entities
- **DTOs**: Data contracts between layers
- **Mappers**: Transform data between different representations

**Why this layer exists:**
```typescript
// Example: RegisterUserUseCase orchestrates business flow
@injectable()
export default class RegisterUserUseCase {
    async execute(request: IRegisterUserRequest): Promise<User> {
        // 1. Check business rule: user uniqueness
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new APIException(/* ... */);
        }
        
        // 2. Apply domain service: password hashing
        const hashedPassword = await this.passwordHasher.hash(password);
        
        // 3. Create domain entity with business rules
        const user = User.create(name, email, hashedPassword);
        
        // 4. Persist through repository interface
        return await this.userRepository.create(user);
    }
}
```

**Key principles:**
- ✅ **Orchestrates** domain entities and services
- ✅ **Application-specific** business rules
- ✅ **Independent** of UI, database, and external concerns
- ✅ **Uses interfaces** defined in domain layer

### 3. 🔌 **Infrastructure Layer (External Interfaces)**

**Purpose**: Implements interfaces defined by inner layers using external tools

**What it includes:**
- **Repository Implementations**: Database access implementations
- **External Services**: API clients, file systems, external integrations
- **Framework Adapters**: Database ORMs, HTTP clients
- **Dependency Injection**: Wiring up the application

**Why this layer exists:**
```typescript
// Example: BcryptPasswordHasher implements domain interface
@injectable()
export default class BcryptPasswordHasher implements IPasswordHasher {
    async hash(password: string): Promise<string> {
        // Uses external bcrypt library
        return await bcrypt.hash(password, this.saltRounds);
    }
}

// Example: PrismaUserRepository implements domain interface
@injectable()
export class PrismaUserRepository implements IUserRepository {
    async create(user: User): Promise<User> {
        // Uses external Prisma ORM
        return this.prisma.user.create(/* ... */);
    }
}
```

**Key principles:**
- ✅ **Implements interfaces** from domain layer
- ✅ **Contains external dependencies** (databases, APIs, frameworks)
- ✅ **Most volatile** - changes frequently with technology updates
- ✅ **Replaceable** without affecting business logic

### 4. 🌐 **Presentation Layer (Controllers & UI)**

**Purpose**: Handles interaction with external world (users, other systems)

**What it includes:**
- **Controllers**: Handle HTTP requests and responses
- **Routers**: Define API endpoints and routing
- **Middleware**: Authentication, validation, logging
- **Input Validation**: Format and structure validation (not business validation)

**Why this layer exists:**
```typescript
// Example: AuthController handles HTTP concerns
@injectable()
export default class AuthController {
    async register(request: Request, response: Response) {
        // 1. Extract data from HTTP request
        const { name, email, password } = request.body;
        
        // 2. Call use case (business logic)
        const user = await this.registerUserUseCase.execute({ name, email, password });
        
        // 3. Convert domain entity to HTTP response format
        const userResponse = {
            id: user.getId(),
            name: user.getName(),
            email: user.getEmail(),
            isBlocked: user.isBlocked()
        };
        
        // 4. Send HTTP response
        return new OK({ data: userResponse }).send(response);
    }
}
```

**Key principles:**
- ✅ **Handles external communication** protocols
- ✅ **Converts** between external formats and internal models
- ✅ **No business logic** - only coordination and formatting
- ✅ **Replaceable** - can switch from REST to GraphQL without changing business logic

## 🔄 How Layers Interact

### **Request Flow Example: User Registration**

```
1. HTTP Request → AuthController (Presentation)
   ↓
2. Extract & validate input format
   ↓
3. Call RegisterUserUseCase (Application)
   ↓
4. Check business rules & orchestrate
   ↓
5. Use IPasswordHasher (Domain Interface)
   ↓
6. BcryptPasswordHasher implementation (Infrastructure)
   ↓
7. Create User entity (Domain)
   ↓
8. Use IUserRepository (Domain Interface)
   ↓
9. PrismaUserRepository implementation (Infrastructure)
   ↓
10. Return User entity → Controller → HTTP Response
```

### **Dependency Inversion in Action**

```typescript
// ❌ BAD: Use case depends on concrete implementation
class RegisterUserUseCase {
    constructor() {
        this.hasher = new BcryptPasswordHasher(); // Concrete dependency!
    }
}

// ✅ GOOD: Use case depends on interface
class RegisterUserUseCase {
    constructor(
        @inject(TYPES.PasswordHasher) private hasher: IPasswordHasher // Interface!
    ) {}
}
```

## 🎯 Clean Architecture Benefits in This Project

### **1. Technology Independence**
- Switch from Express to Fastify: Only change Presentation layer
- Move from Prisma to TypeORM: Only change Infrastructure layer
- Add GraphQL support: Add new Presentation layer, reuse everything else

### **2. Testability**
```typescript
// Test use case without database or HTTP server
describe('RegisterUserUseCase', () => {
    it('should create user', async () => {
        // Use in-memory implementations for testing
        const mockRepo = new InMemoryUserRepository();
        const mockHasher = new MockPasswordHasher();
        const useCase = new RegisterUserUseCase(mockRepo, mockHasher);
        
        const result = await useCase.execute({ name, email, password });
        expect(result).toBeDefined();
    });
});
```

### **3. Team Collaboration**
- **Frontend team**: Works with Presentation layer contracts
- **Backend team**: Focuses on Application and Domain layers
- **DevOps team**: Handles Infrastructure implementations
- **QA team**: Tests through Use Case interfaces

### **4. Maintenance & Evolution**
- Add new features: Create new Use Cases
- Change business rules: Modify Domain entities
- Integrate new services: Add Infrastructure implementations
- Support new clients: Add Presentation adapters

This architecture ensures your codebase remains **clean**, **maintainable**, and **adaptable** to changing requirements! 🚀

## 📁 Project Structure

```
src/
├── domain/                     # Core Business Logic (Innermost Layer)
│   ├── entities/              # Business Entities
│   │   ├── Base.ts           # Base entity class
│   │   └── User.ts           # User business entity
│   ├── repositories/         # Repository Interfaces
│   │   └── IUserRepository.ts
│   └── services/             # Domain Service Interfaces
│       └── IPasswordHasher.ts
│
├── application/              # Application Business Rules
│   ├── use-case/            # Use Cases (Application Services)
│   │   ├── auth/
│   │   │   ├── LoginUserUseCase.ts
│   │   │   └── RegisterUserUseCase.ts
│   │   └── user/
│   │       └── GetProfileUseCase.ts
│   ├── dtos/                # Data Transfer Objects
│   │   └── auth/
│   │       └── AuthDto.ts
│   └── mappers/             # Domain ↔ DTO Mappers
│       └── UserMapper.ts
│
├── infrastructure/          # External Interfaces & Implementation
│   ├── container/          # Dependency Injection
│   │   ├── container.ts    # Main DI Container
│   │   ├── types.ts        # DI Symbol Types
│   │   └── bindings/       # DI Bindings
│   │       ├── controller.bindings.ts
│   │       ├── repository.bindings.ts
│   │       ├── service.bindings.ts
│   │       └── use-case.bindings.ts
│   ├── repositories/       # Repository Implementations
│   │   ├── memory/
│   │   │   └── InMemoryUserRepository.ts
│   │   └── prisma/
│   │       └── PrismaUserRepository.ts
│   └── services/          # External Service Implementations
│       └── BcryptPasswordHasher.ts
│
├── presentation/           # Controllers, Routes, Validation
│   ├── controllers/       # HTTP Controllers
│   │   ├── AuthController.ts
│   │   └── UserController.ts
│   ├── http/             # HTTP Server & Responses
│   │   ├── server.ts
│   │   └── response/
│   │       └── successResponse.ts
│   ├── router/           # Route Definitions
│   │   ├── appRouter.ts
│   │   ├── auth.router.ts
│   │   └── user.router.ts
│   └── validation/       # Input Validation
│       ├── auth/
│       │   ├── base.ts
│       │   ├── loginUserSchema.ts
│       │   └── registerUserSchema.ts
│       └── common/
│           └── extractDefaultsFromSchema.ts
│
└── shared/               # Shared Utilities & Types
    ├── common/          # Common Types & Constants
    │   ├── appMessage.ts
    │   ├── responsibility.ts
    │   ├── constant/
    │   │   └── index.ts
    │   └── types/
    │       └── base.ts
    ├── exception/       # Error Handling
    │   └── base.ts
    └── helper/         # Utility Functions
        └── base.ts
```

## 📋 Code Conventions

### 1. **Naming Conventions**

#### Classes & Interfaces
```typescript
// Entities (PascalCase)
export default class User extends Base { }

// Interfaces (I prefix + PascalCase)
export interface IUserRepository { }
export interface IPasswordHasher { }

// Use Cases (PascalCase + UseCase suffix)
export default class RegisterUserUseCase { }

// Controllers (PascalCase + Controller suffix)
export default class AuthController { }

// DTOs (PascalCase + Dto suffix)
export interface RegisterUserDto { }
```

#### Files & Folders
```
// Files (PascalCase.ts)
User.ts
AuthController.ts
IUserRepository.ts

// Folders (kebab-case)
use-case/
auth/
infrastructure/
```

#### Methods & Variables
```typescript
// Methods (camelCase)
public async execute(): Promise<User> { }
public getName(): string { }

// Private fields (camelCase with private keyword)
private userRepository: IUserRepository;
private readonly saltRounds: number;
```

### 2. **Dependency Injection Patterns**

#### Interface Definition (Domain Layer)
```typescript
// src/domain/services/IPasswordHasher.ts
export interface IPasswordHasher {
    hash(password: string): Promise<string>;
    compare(password: string, hashedPassword: string): Promise<boolean>;
    validateStrength?(password: string): Promise<{ isValid: boolean; errors: string[]; }>;
}
```

#### Implementation (Infrastructure Layer)
```typescript
// src/infrastructure/services/BcryptPasswordHasher.ts
import { injectable } from 'inversify';
import { IPasswordHasher } from '../../domain/services/IPasswordHasher';

@injectable()
export default class BcryptPasswordHasher implements IPasswordHasher {
    private readonly saltRounds: number;
    
    constructor(saltRounds: number = 12) {
        this.saltRounds = saltRounds;
    }
    
    // Implementation...
}
```

#### Use Case Injection (Application Layer)
```typescript
// src/application/use-case/auth/RegisterUserUseCase.ts
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/container/types';

@injectable()
export default class RegisterUserUseCase {
    constructor(
        @inject(TYPES.UserRepository) private userRepository: IUserRepository,
        @inject(TYPES.PasswordHasher) private passwordHasher: IPasswordHasher
    ) {}
}
```

#### Controller Injection (Presentation Layer)
```typescript
// src/presentation/controllers/AuthController.ts
import { injectable, inject } from 'inversify';
import { TYPES } from '../../infrastructure/container/types';

@injectable()
export default class AuthController {
    constructor(
        @inject(TYPES.RegisterUserUseCase) private registerUserUseCase: RegisterUserUseCase,
        @inject(TYPES.LoginUserUseCase) private loginUserUseCase: LoginUserUseCase
    ) {}
}
```

### 3. **Error Handling Patterns**

#### Exception Classes
```typescript
// Consistent error structure
throw new APIException(
    Responsibility.CLIENT_BAD_REQUEST,
    AppMessage.API_E_008,
    [new AppGlobalError("API_E_008", AppMessage.API_E_008)]
);
```

#### Response Patterns
```typescript
// Success responses
return new OK({ data: userResponse }).send(response);
return new CREATED({ data: user }).send(response);
```

### 4. **Entity Patterns**

#### Domain Entity Structure
```typescript
export default class User extends Base {
    // Private fields
    private name: string;
    private email: string;
    
    // Constructor
    constructor(id: string, name: string, email: string, password: string) {
        super(id);
        // Initialize fields
    }
    
    // Factory method
    public static create(name: string, email: string, password: string): User {
        const id = uuid();
        return new User(id, name.trim(), email, password);
    }
    
    // Getters/Setters
    public getName(): string { return this.name; }
    public setName(name: string): void { this.name = name; }
    
    // Business methods
    public comparePassword(password: string): boolean { }
    public block(): void { }
    public unblock(): void { }
}
```

### 5. **Repository Patterns**

#### Interface (Domain Layer)
```typescript
export interface IUserRepository {
    create(user: User): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    update(user: User): Promise<void>;
    delete(id: string): Promise<void>;
    findAll(): Promise<User[]>;
}
```

#### Implementation (Infrastructure Layer)
```typescript
@injectable()
export class InMemoryUserRepository implements IUserRepository {
    private users: User[] = [];
    
    async create(user: User): Promise<User> { }
    async findById(id: string): Promise<User | null> { }
    // Other methods...
}
```

### 6. **Validation Patterns**

#### Schema Definition
```typescript
// Zod schema with custom validation
const registerUserSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6)
}).superRefine((data, ctx) => {
    validatePasswordStrength(data.password, ctx);
    validateEmail(data.email, ctx);
});
```

#### Custom Validators
```typescript
export function validatePasswordStrength(
    password: string,
    ctx: z.RefinementCtx,
    fieldPath: string = 'password'
) {
    if (password.length < 6) {
        ctx.addIssue({
            path: [fieldPath],
            code: z.ZodIssueCode.custom,
            message: 'Password must be at least 6 characters long',
        });
    }
}
```

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## 🛠️ Technology Stack

- **TypeScript** - Type-safe JavaScript
- **Express.js** - Web framework
- **Inversify** - Dependency injection container
- **Zod** - Schema validation
- **Bcrypt** - Password hashing
- **UUID** - Unique identifier generation
- **Lodash** - Utility library

## 📚 Key Principles

1. **Dependency Inversion** - High-level modules don't depend on low-level modules
2. **Single Responsibility** - Each class has one reason to change
3. **Open/Closed** - Open for extension, closed for modification
4. **Interface Segregation** - Clients shouldn't depend on interfaces they don't use
5. **Liskov Substitution** - Objects should be replaceable with instances of their subtypes

## 🔧 Environment Variables

```env
NODE_ENV=development
PORT=3000
```

## 📝 API Documentation

### Health Check
```http
GET /health-check
```

### Authentication
```http
POST /api/auth.register
POST /api/auth.login
```

### User Management
```http
GET /api/user.getProfile
```