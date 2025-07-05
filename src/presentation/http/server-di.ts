import 'reflect-metadata'; // Must be imported first for Inversify
import express from "express";
import cors from "cors";
import { container } from "../../infrastructure/container/container";
import { TYPES } from "../../infrastructure/container/types";
import RegisterUserUseCase from "../../application/use-case/RegisterUserUseCase";
import { CreateUserController } from "../controllers/CreateUserController";

const app = express();
const PORT = process.env.PORT || 3000;

// Get dependencies from DI container
const registerUserUseCase = container.get<RegisterUserUseCase>(TYPES.RegisterUserUseCase);
const createUserController = new CreateUserController(registerUserUseCase);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/v1/user', createUserController.handle.bind(createUserController));

app.get('/', (req, res) => {
    res.send('Welcome to the Clean Architecture API with Inversify DI!');
});

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is running with Dependency Injection',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`👤 Create user endpoint: POST http://localhost:${PORT}/api/v1/user`);
});

export default app;
