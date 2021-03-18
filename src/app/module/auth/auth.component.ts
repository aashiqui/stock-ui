import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {UserService} from '../../service/user-service.service';
import {TokenStorageService} from '../../service/token-storage.service';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  
  roles: any[] = [];
  signinForm: FormGroup;
  username:FormControl;
  password:FormControl;
  errMsg: string;
  
  constructor( public router: Router,    public fb: FormBuilder, private tokenStorage: TokenStorageService, private userService: UserService) { 


    this.username = new FormControl('', Validators.required);
    this.password = new FormControl('', Validators.required);
    this.signinForm = this.fb.group({
      username:this.username,
      password: this.password
    })
  }

  ngOnInit(): void {
    if (this.tokenStorage.getUser()) {
    
      this.roles = this.tokenStorage.getUser().role;
      this.router.navigate(['dashboard/']);

    }
  }

  onSubmit(): void {
  
    console.log(JSON.stringify(this.signinForm.value))
    const user =this.userService.getAuthenticatedUser(this.signinForm.value)[0];
     console.log(user)
        if(user)
      {  
        
        this.tokenStorage.saveUser(user);

        
        this.roles = this.tokenStorage.getUser().role;
       
        this.router.navigate(['dashboard/']);

      }else{

        this.errMsg="Bad Credential !"
      }

      
  }

}

