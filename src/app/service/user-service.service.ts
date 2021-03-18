import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user = [{
    id: 1,
    username: 'john',
    password: 'freespace123',
    role: ['ADMIN']
  },
  {
    id: 2,
    username: 'jane',
    password: 'freespace321',
    role: ['USER']
  }];
  constructor() { }


  getAuthenticatedUser(user) {


    const users=this.user.filter(userObj => {


      return userObj.username == user.username && userObj.password == user.password;
    })

    return users;

  }



}
