import express from "express";
import cors from "cors";
import { PrismaUserRepository } from "../../infrastructure/repositories/prisma/PrismaUserRepository";
import BcryptPasswordHasher from "../../application/services/BcryptPasswordHasher ";
import RegisterUserUseCase from "../../application/use-case/RegisterUserUseCase";
import { CreateUserController } from "../controllers/CreateUserController";

const app = express();
const PORT = process.env.PORT || 3000;

const userRepository = new PrismaUserRepository();
const bcryptPasswordHasher = new BcryptPasswordHasher();
const registerUserUseCase = new RegisterUserUseCase(userRepository, bcryptPasswordHasher);
const createUserController = new CreateUserController(registerUserUseCase);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/api/v1/user', createUserController.handle.bind(createUserController));
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
