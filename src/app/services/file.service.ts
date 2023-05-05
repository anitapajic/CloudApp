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
    var typeFolder = this.findFolder(file.type.split('/')[0]);

    var fileDir = '/' + file.username + '/' + typeFolder + '/' + file.name
    // Upisi prvo ovde
    if(file.favourite){
      fileDir = '/' + file.username + '/favourites/' + file.name
      // ako je fav upisi i ovde

    }

    //kad sve zavrsi upisi metadata
    this.uploadFileData(file);

  }

  findFolder(type: string) {
    if(type=='image')
      return 'photos';
    else if(type == 'video')
      return 'videos'
    else if(type == 'application')
      return 'documents'
    else
      return 'other'  
  }

  

  uploadFileData(file: IFile){

  }


}
