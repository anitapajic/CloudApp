import {Component, OnInit} from '@angular/core';
import {IUser} from "../model/User";
import {CognitoService} from "../services/cognito.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{

  user : IUser = {} as IUser;
  constructor(private cognitoService:CognitoService) {
  }
  public ngOnInit(): void {
    this.cognitoService.getUser().then((user)=>{
      this.user = user.attributes;
      console.log(user);
      }
    )
  }


}
