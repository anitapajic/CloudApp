import { Injectable } from '@angular/core';
import { IFile } from '../model/File';
import { environment } from 'src/environments/environment';
import { CognitoService } from './cognito.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private cognito: CognitoService) { }


  async uploadFile(file : IFile){

    await this.cognito.getUser().then((value: any) => {
      file.username = value.attributes.email;
    })

    var fileDir = '/' + file.username + '/' + file.type.split('/')[0] + '/' + file.name
    console.log(fileDir)
    console.log(file)

  }

  uploadFileData(file: IFile){

  }


}
