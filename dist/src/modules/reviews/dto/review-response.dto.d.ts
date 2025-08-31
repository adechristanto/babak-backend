import { UserResponseDto } from '../../users/dto/user-response.dto';
export declare class ReviewResponseDto {
    id: number;
    listingId: number;
    reviewerId: number;
    rating: number;
    comment?: string;
    createdAt: string;
    reviewer: UserResponseDto;
    constructor(partial: Partial<ReviewResponseDto>);
}
