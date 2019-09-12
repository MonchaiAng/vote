import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth/auth.service';
import {Router} from '@angular/router';
import {SESSION_STORAGE, WebStorageService} from 'angular-webstorage-service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  validateForm: FormGroup;
  username: String='';
  password: String='';
  uID: number;
  posn: string;
  public data:any=[]
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  constructor(private fb: FormBuilder,private authService:AuthService,private router: Router,
    @Inject(SESSION_STORAGE) private storage: WebStorageService,private nzMessageService: NzMessageService,) {}
  
  // onLogin(username,password){
  //   this.authService.postAuthorization(username[0],password[0])
  //     .subscribe(data => {
  //         if(data["user"] == null){
  //         this.nzMessageService.create('error','incorrect username or password!');
  //         }else{
  //           this.uID=data["user"]["uID"]
  //           this.posn=data["user"]["posn"]
  //           console.log(data)
  //           this.authService.getUserProfile(JSON.stringify(this.uID)).then(data => { 
  //             if(data.statusDescEn == "Success"){
  //               this.router.navigate(['/home']);
  //               this.authService.setState(true,username,password,this.posn,this.uID);
  //             }
  //           }).catch(err =>{
  //             console.log(err)
  //           })
  //         }
  //       }
  //     );
      
  // }

  onLogin(username,password){
    if(username == "got" && password == "0000"){
      this.router.navigate(['/home']);
      // this.authService.setState(true,username,password,"Center");
      this.authService.setState(true,username,password,'Officer',2);
    }
  }
 
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

}
