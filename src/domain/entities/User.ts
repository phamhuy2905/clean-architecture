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
        const id = uuid();
        return new User(id, name.trim(), email, password);
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

    public getPassword(): string {
        return this.password;
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