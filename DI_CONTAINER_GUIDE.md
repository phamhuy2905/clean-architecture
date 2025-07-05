# Clean architecture

```
src/
├── infrastructure/
│   ├── container/
│   │   ├── types.ts                    # Symbol definitions cho DI
│   │   ├── container.ts                # Main container configuration
│   │   └── bindings/                   # Module bindings
│   │       ├── repository.bindings.ts  # Repository bindings
│   │       ├── service.bindings.ts     # Service bindings
│   │       └── usecase.bindings.ts     # Use case bindings
│   ├── repositories/
│   │   ├── memory/
│   │   │   └── InMemoryUserRepository.ts  # @injectable
│   │   └── prisma/
│   │       └── PrismaUserRepository.ts    # @injectable
│   └── services/
│       └── BcryptPasswordHasher.ts       # @injectable
├── application/
│   └── use-case/
│       └── RegisterUserUseCase.ts        # @injectable + @inject
└── presentation/
    └── http/
        ├── server.ts                     # Original server
        └── server-di.ts                  # Server with DI container
```