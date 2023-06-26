import { Injectable } from '@angular/core';
import { IFile, metaIFile } from '../model/File';
import { environment } from 'src/environments/environment';
import { CognitoService } from './cognito.service';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { JsonPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  s3_path: string = 'https://c3bmmftrka.execute-api.us-east-1.amazonaws.com/dev/tim19-bucket';

  constructor(private cognito: CognitoService, private http:HttpClient) { }

  meta : string = 'https://c3bmmftrka.execute-api.us-east-1.amazonaws.com/dev/';



  async uploadFile(file : IFile){

    await this.cognito.getUser().then((value: any) => {
      file.username = value.attributes.email;
    })
    var typeFolder = this.findFolder(file.type.split('/')[0]);

    var fileDir = file.username + '/' + typeFolder + '/' + file.name

    file.id = fileDir

    const reader = new FileReader();
    reader.readAsDataURL(file.file);
    reader.onload = () => {
      var encodedFile = reader.result as string
      encodedFile =  encodedFile.split(',')[1];
      this.uploadFileData(file, encodedFile);
      if(file.favourite){
        file.id = file.username + '/favourites/' + file.name
        this.uploadFileData(file, encodedFile);

      }

    }

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



  uploadFileData(file: IFile, encodedFile : string){

    var meta : metaIFile = {
      id: file.id,
      name: file.name,
      description: file.description,
      type: file.type,
      tags: file.tags,
      favourite: file.favourite,
      username : file.username,
      size: file.size.toString(),
      date_uploaded : file.date_uploaded,
      date_modified : file.date_modified,
      file : encodedFile
    }

    console.log(meta);
    this.http.post(this.meta + "files", JSON.stringify(meta)).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(meta);
        console.error(error);
      }
    );

  }

  updateFile(meta:metaIFile){
    this.http.put(this.meta + "files", JSON.stringify(meta)).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getFolders(prefix: string): Observable<string[]> {
    return this.http.get<string[]>(this.meta + 'bucket/' + prefix);
  }

  getPictureData(sufix : string) : Observable<any> {
    return this.http.get('https://c3bmmftrka.execute-api.us-east-1.amazonaws.com/dev/files/' + sufix)

  }

}
