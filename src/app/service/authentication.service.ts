import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  userid: string;
  emp_name: string;
  userRole: string;

  constructor() { }

  authenticate(userid, username, role) {
      sessionStorage.setItem('userid', userid);
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('userRole', role);

      this.userid = sessionStorage.getItem('userid') as string;
      this.emp_name = sessionStorage.getItem('username') as string;
      this.userRole = sessionStorage.getItem('userRole') as string;
      return true;
  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem('userid')
    // console.log(!(user === null))
    return !(user === null)
  }

  logOut() {
    sessionStorage.removeItem('userid')
  }
}
