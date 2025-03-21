export class ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

export class KeyVal {
    key: string;
    value: number;
}

export enum ApiStatus {
    Success = 1,
    Failed = 2,
    AlreadyExists = 3,
    DependancyExists = 4,
    NotPermitted = 5,
    UserInactive = 6,
    UserNotFound = 7,
    MasterFileNotFound = 8,
    TenantInactive = 9,
    TenantNotFound = 10,
    LicenseExpired = 11
}