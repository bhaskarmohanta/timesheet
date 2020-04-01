import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from '../service/authentication.service';

declare var $: any;

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  constructor(private loginService: AuthenticationService) { }

  isLoggedIn = false;
  loggedInUser = '';
  ngOnInit(): void {
    this.isLoggedIn = this.loginService.isUserLoggedIn();
    this.loggedInUser = sessionStorage.getItem("username");
  }
}



