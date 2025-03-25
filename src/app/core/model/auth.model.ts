export class LoginReq {
    email: string;
    password: string;
}

export class OtpResp {
    message: string;
}

export class LoginResp {
    refresh: string;
    access: string;
    email: string;
    firstname: string;
    lastname: string;
    usertype: string;
}

export class RegisterReq {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

export class RegisterResp {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}



