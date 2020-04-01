import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { HttpErrorResponse, HttpClient } from "@angular/common/http"

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css'
  ]
})
export class LoginComponent implements OnInit {
  // userid = ''
  password = ''
  // emp_name = '';
  // role = '';
  invalidLogin = false;

  constructor(private router: Router,
    private loginservice: AuthenticationService, private httpService: HttpClient) { }

  employeeData: any[];
  ngOnInit() {
    this.employeeData = null;
    this.httpService.get("http://localhost:8080/ListEmployees").subscribe(
      data => {
        this.employeeData = data as any[];
      },
      (err: HttpErrorResponse) => { }
    );
  }

  checkLogin() {
    // console.log(this.employeeData);

    if (this.employeeData !== null) {
      this.loginservice.userid = (<HTMLInputElement>document.getElementById("userid")).value;
      this.password = (<HTMLInputElement>document.getElementById("password")).value;

      if (this.employeeData.some((element) => element.emp_id == this.loginservice.userid && element.password == this.password)) {

        for (var key in this.employeeData) {
          if (this.employeeData[key].emp_id == this.loginservice.userid) {
            this.loginservice.emp_name = this.employeeData[key].emp_name;
            this.loginservice.userRole = this.employeeData[key].role;
          }
        }
        if (this.loginservice.authenticate(this.loginservice.userid, this.loginservice.emp_name, this.loginservice.userRole)) {
          this.router.navigate(['/dashboard/viewts'])
          this.invalidLogin = false
        } else
          this.invalidLogin = true
      } else {
        $("#loginError").html('<h4><span style="color: crimson;">Bad credentials!! </span>' +
          'You are not authorized to Login</h4>');
      }
    } else {
      $("#loginError").html('<h4><span style="color: crimson;">No user found for this!!</span></h4>');
    }
  }

}
