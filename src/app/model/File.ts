export interface IFile{
  id: string;
  file: File;
  name: string;
  description: string;
  tags: string[];
  favourite: boolean;
  username : string;
  type: string;
  size: number;
  date_uploaded : Date;
  date_modified : Date;
}

export interface metaIFile{
  id: string;
  name: string;
  description: string;
  tags: string[];
  favourite: boolean;
  username : string;
  type: string;
  size: string;
  date_uploaded : Date;
  date_modified : Date;
  file : string;
}
