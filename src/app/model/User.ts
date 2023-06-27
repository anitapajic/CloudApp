export interface IUser{
    username: string;
    password: string;
    showPassword: boolean;
    family_name: string;
    registration_code : string;
    code: string;
    name: string;
}

export interface newIUser{
    username: string;
    password: string;
    name: string;
    family_name: string;
    folders : string[];
}