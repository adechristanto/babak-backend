import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    findAll(): Promise<UserResponseDto[]>;
    getProfile(req: any): Promise<UserResponseDto>;
    findOne(id: number): Promise<UserResponseDto>;
    updateProfile(req: any, updateUserDto: UpdateUserDto): Promise<UserResponseDto>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
