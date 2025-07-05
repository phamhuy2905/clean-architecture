import { v4 as uuid } from 'uuid';
import Base from "./Base";

export default class User extends Base {
    private name: string;
    private email: string;
    private password: string;
    private isBlock: boolean = false;

    constructor(id: string, name: string, email: string, password: string) {
        super(id);
        this.name = name;
        this.email = email;
        this.password = password;
    }

    public static create(name: string, email: string, password: string): User {
        // Validate input parameters
        if (!name || name.trim().length === 0) {
            throw new Error("Name is required and cannot be empty");
        }

        if (!email || email.trim().length === 0) {
            throw new Error("Email is required and cannot be empty");
        }

        if (!this.isValidEmail(email)) {
            throw new Error("Invalid email format");
        }

        if (!password || password.length < 6) {
            throw new Error("Password must be at least 6 characters long");
        }

        const id = uuid();
        return new User(id, name.trim(), email.toLowerCase().trim(), password);
    }

    private static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public setPassword(password: string): void {
        this.password = password;
    }

    public comparePassword(password: string): boolean {
        return this.password === password;
    }


    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public isBlocked(): boolean {
        return this.isBlock;
    }

    public block(): void {
        this.isBlock = true;
    }

    public unblock(): void {
        this.isBlock = false;
    }

    public toString(): string {
        return `User [id=${this.getId()}, name=${this.name}, email=${this.email}]`;
    }
}