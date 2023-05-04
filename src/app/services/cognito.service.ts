import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IUser } from '../model/User';
import { Amplify, Auth } from 'aws-amplify';

@Injectable({
  providedIn: 'root'
})
export class CognitoService {
 

  constructor() {
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

}
