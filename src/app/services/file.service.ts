import { Injectable } from '@angular/core';
import { IFile, metaIFile } from '../model/File';
import { CognitoService } from './cognito.service';
import {HttpClient} from "@angular/common/http";
import { Observable } from 'rxjs';
import { HomeComponent } from '../home/home.component';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  s3_path: string = 'https://c3bmmftrka.execute-api.us-east-1.amazonaws.com/dev/tim19-bucket';

  homeComponent: HomeComponent | null = null;

  constructor(private cognito: CognitoService, private http:HttpClient) {}

  meta : string = 'https://c3bmmftrka.execute-api.us-east-1.amazonaws.com/dev/';



  async uploadFile(file : IFile){

    await this.cognito.getUser().then((value: any) => {
      file.username = value.attributes.email;
    })

    var typeFolder = this.findFolder(file.username, file.type.split('/')[0]);

    var fileDir =  typeFolder + '/' + file.name

    console.log(fileDir, " filedir")
    file.id = fileDir

    const reader = new FileReader();
    reader.readAsDataURL(file.file);
    reader.onload = () => {
      var encodedFile = reader.result as string
      encodedFile =  encodedFile.split(',')[1];
      this.uploadFileData(file, encodedFile);


    }

  }

  findFolder(username: string, type: string) {
    let currentFolder = this.homeComponent?.currentFolder;
    let rootFolder = this.homeComponent?.rootFolder;

    if(currentFolder != rootFolder){
      return currentFolder?.replaceAll("%2F", '/');
    }
    if(type=='image')
      return username + '/' + 'photos';
    else if(type == 'video')
      return username + '/' + 'videos'
    else if(type == 'application')
      return username + '/' + 'documents'
    else
      return username + '/' + 'other'
  }

  setHomeComponent(home : HomeComponent){
    this.homeComponent = home;
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

    this.http.post(this.meta + "files", JSON.stringify(meta)).subscribe(
      (response) => {
        console.log(response);
        this.homeComponent?.getFolders();

        let data = {
          "subject" : "File uploaded",
          "content" : "You successfully uploaded file " + meta.name +".",
        }
        this.sendNotification(data).subscribe(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.error(error);
          }
        );
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
        let data = {
          "subject" : "File update",
          "content" : "You successfully updated file " + meta.name +".",
        }
        this.sendNotification(data).subscribe(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.error(error);
          }
        );


      },
      (error) => {
        console.error(error);
      }
    );
  }

  getFolders(prefix: string): Observable<string[]> {
    return this.http.get<string[]>(this.meta + 'folder/' + prefix);
  }

  createNewFolder(id : any) : Observable<any>{
    return this.http.post(this.meta + 'folder', id);
  }

  deleteFolder(data : any) : Observable<any> {
    return this.http.post('https://c3bmmftrka.execute-api.us-east-1.amazonaws.com/dev/deleteFolder', data)
  }

  getPictureData(sufix : string) : Observable<any> {
    return this.http.get('https://c3bmmftrka.execute-api.us-east-1.amazonaws.com/dev/files/' + sufix)
  }

  deleteFile(sufix : string) : Observable<any> {
    return this.http.delete('https://c3bmmftrka.execute-api.us-east-1.amazonaws.com/dev/files/' + sufix)
  }

  downloadFile(sufix : string) : Observable<any>{
    return this.http.get('https://c3bmmftrka.execute-api.us-east-1.amazonaws.com/dev/download/' + sufix)
  }


  sendNotification(data : any){
    return this.http.post('https://c3bmmftrka.execute-api.us-east-1.amazonaws.com/dev/sendSMS', data)
  }

}
