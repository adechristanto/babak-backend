export declare enum OfferStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    COUNTERED = "COUNTERED",
    WITHDRAWN = "WITHDRAWN",
    EXPIRED = "EXPIRED"
}
export declare class UpdateOfferDto {
    status: OfferStatus;
    counterAmount?: number;
    responseMessage?: string;
}
