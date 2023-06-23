import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IUser, newIUser } from '../model/User';
import { Amplify, Auth } from 'aws-amplify';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  s3_path: string = 'https://c3bmmftrka.execute-api.us-east-1.amazonaws.com/dev/users';


  constructor( private http:HttpClient) {
    Amplify.configure({
      Auth:environment.cognito
    })
   }

  signUp(user: IUser):Promise<any>{
    return Auth.signUp({
      username:user.username,
      password:user.password
    })
   }

  verify(user: IUser):Promise<any> {
    return Auth.confirmSignUp(user.username,user.code);
  }

  signIn(user:IUser):Promise<any> {
    return Auth.signIn(user.username, user.password);
  }

  async getUser():Promise<any>{
    return Auth.currentUserInfo();
  }

  uploadUser(user: newIUser){

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };



    console.log(user)
    this.http.post(this.s3_path, user).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error(error);
      }
    );


  }



}
