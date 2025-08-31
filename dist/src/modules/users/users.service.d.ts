import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserResponseDto } from './dto/user-response.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    findAll(): Promise<UserResponseDto[]>;
    findOne(id: number): Promise<UserResponseDto>;
    findByEmail(email: string): Promise<User | null>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto>;
    remove(id: number): Promise<void>;
    validatePassword(user: User, password: string): Promise<boolean>;
    findByEmailVerificationToken(token: string): Promise<User | null>;
    markEmailAsVerified(userId: number): Promise<void>;
    updateEmailVerificationToken(userId: number, token: string, expires: Date): Promise<void>;
    changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<void>;
}
