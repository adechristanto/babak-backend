export declare enum UploadFolder {
    LISTINGS = "listings",
    AVATARS = "avatars",
    DOCUMENTS = "documents"
}
export declare class UploadRequestDto {
    fileName: string;
    contentType: string;
    folder?: UploadFolder;
}
