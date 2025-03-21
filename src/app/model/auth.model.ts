export class Auth {
    username: string;
    password: string;
}

export class AuthResp {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    userTypeId: number;
    userType: UserType;
    isActive: boolean;
    isDeleted: boolean;
    isUniversal: boolean;
    isNewPassword: boolean;
    userTypeName: string;
    accessToken: string;
}

export class UserType
{
    id: number;
    name: string;
    isAdmin: boolean;
    isActive: boolean;
}
