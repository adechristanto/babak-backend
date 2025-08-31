export declare class NotificationResponseDto {
    id: number;
    type: string;
    title: string;
    body: string | null;
    actionUrl: string | null;
    read: boolean;
    createdAt: Date;
    constructor(partial: Partial<NotificationResponseDto>);
}
