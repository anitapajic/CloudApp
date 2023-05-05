import { Injectable } from '@angular/core';
import { IFile } from '../model/File';
import { environment } from 'src/environments/environment';
import { CognitoService } from './cognito.service';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FileService {
  s3_path: string = 'https://ihsotip46f.execute-api.us-east-1.amazonaws.com/dev/tim19-bucket';

  constructor(private cognito: CognitoService, private http:HttpClient) { }


  async uploadFile(file : IFile){


    await this.cognito.getUser().then((value: any) => {
      file.username = value.attributes.email;
    })
    var typeFolder = this.findFolder(file.type.split('/')[0]);

    var fileDir = '/' + file.username + '/' + typeFolder + '/' + file.name
    this.http.put<any>(this.s3_path + fileDir , file.file).subscribe((response)=>{
      console.log(response);
    });
    if(file.favourite){
      fileDir = '/' + file.username + '/favourites/' + file.name
      // response = this.http.put<any>(this.s3_path + fileDir , file.file);
      // console.log(response);

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
