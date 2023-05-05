export interface IFile{
    file: File;
    name: string;
    description: string;
    tags: string[];
    favourite: boolean;
    username : string;
    type: string;
    size: number;
    date : Date;
    modified : Date;
}