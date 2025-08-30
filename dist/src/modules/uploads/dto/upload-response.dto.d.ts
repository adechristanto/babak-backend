export declare class UploadResponseDto {
    uploadUrl: string;
    fileUrl: string;
    key: string;
    expiresIn: number;
    constructor(data: {
        uploadUrl: string;
        fileUrl: string;
        key: string;
        expiresIn: number;
    });
}
