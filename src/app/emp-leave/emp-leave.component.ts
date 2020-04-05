import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { HttpErrorResponse } from "@angular/common/http"
import { AuthenticationService } from '../service/authentication.service';
import * as moment from 'moment';

declare var $: any;
var generateSubLink;
var localSubLink;

interface Food {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'app-emp-leave',
    templateUrl: './emp-leave.component.html',
    styleUrls: ['./emp-leave.component.css']
})
export class EmpLeaveComponent implements OnInit {

    constructor(private httpService: HttpClient, private loginService: AuthenticationService) { }

    userRole: string;
    leaveTypes: any[];
    employeeData: any[];
    currentEmployee: string;
    ngOnInit(): void {
        this.userRole = sessionStorage.getItem('userRole');
        this.leaveTypes = [
            { id: 1, name: "SL" },
            { id: 2, name: "CL" },
            { id: 3, name: "UL" },
            { id: 4, name: "EL" },
            { id: 5, name: "Holiday" },
            { id: 6, name: "Other" },
        ];
        $('#fromdatesrc, #todatesrc, #fromdatesrc_modal, #todatesrc_modal').datepicker({
            format: "d-M-yyyy",
            autoclose: true,
            todayHighlight: true,
            maxViewMode: 1
        });

        let date = new Date();
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        $("#fromdatesrc").datepicker("setDate", firstDay);
        $("#todatesrc").datepicker("setDate", lastDay);

        this.httpService.get("http://localhost:8080/ListEmployees").subscribe(
            data => {
                this.employeeData = data as any[];
                this.currentEmployee = sessionStorage.getItem("userid");
            },
            (err: HttpErrorResponse) => {
                $("#reportsOf").html(
                    '<div class="alert alert-danger"><strong>No data!</strong> No matched data found for this given values... </div>'
                );
            }
        );
    }

    to_date() {
        $('#todatesrc').datepicker('show');
    }
    from_date() {
        $('#fromdatesrc').datepicker('show');
    }
    to_date_modal() {
        $('#todatesrc_modal').datepicker('show');
    }
    from_date_modal() {
        $('#fromdatesrc_modal').datepicker('show');
    }

    employeeLeavesData;
    loadList() {
        // $("#leave_reports").html("");
        if ($("#fromdatesrc").val() == "") {
            $.notify("Select a Starting Date");
            $("#fromdatesrc").focus();
            return;
        }
        if ($("#todatesrc").val() == "") {
            $.notify("Select a Ending Date");
            $("#todatesrc").focus();
            return;
        }
        if ($("#leave_type").val() == 0) {
            $.notify("Select a type of leave");
            $("#leave_type").focus();
            return;
        }

        let from_date = moment(($("#fromdatesrc").val()), "DD-MMM-YYYY").format('YYYYMMDD');
        let to_date = moment(($("#todatesrc").val()), "DD-MMM-YYYY").format('YYYYMMDD');

        let url = "http://localhost:8080/EmployeeLeavesView/" + $("#employee option:selected").val() + "/" + $("#status").val() + "/" + from_date + "/" + to_date;
        this.httpService.get(url).subscribe(
            data => {
                this.employeeLeavesData = data as any[];
            },
            (err: HttpErrorResponse) => {
                $("#reportsOf").html(
                    '<div class="alert alert-danger"><strong>No data!</strong> No matched data found for this given values... </div>'
                );
            }
        );
    }

    saveData() {
        if ($("#fromdatesrc_modal").val() == "") {
            $.notify("Select a Starting Date");
            $("#fromdatesrc_modal").focus();
            return;
        }
        if ($("#todatesrc_modal").val() == "") {
            $.notify("Select a Ending Date");
            $("#todatesrc_modal").focus();
            return;
        }
        if ($("#leave_type").val() == 0) {
            $.notify("Select a type of leave");
            $("#leave_type").focus();
            return;
        }
        var data = $("#form_leave").serializeArray();

        let leave_details = {};

        leave_details["emp_id"] = sessionStorage.getItem("userid");
        leave_details["from_date"] = moment((data[0]["value"]), "DD-MMM-YYYY").format('YYYY-MM-DD');
        leave_details["to_date"] = moment((data[1]["value"]), "DD-MMM-YYYY").format('YYYY-MM-DD');
        leave_details["leave_cmnt"] = data[2]["value"];
        leave_details["leave_type"] = data[3]["value"];

        this.httpService.post("http://localhost:8080/EmployeeLeave", leave_details)
            .toPromise()
            .then(response => response)
            .catch();

    }

    // Change status approve or disapprove of employee leave
    changeStatusOfLeave(id) {

        if ($("#status_" + id).val() == 0) {
            $.notify("Select status!");
            $("#status").focus();
            return;
        }

        var data = $("#adminUpdate_" + id).serializeArray();
        let admin_update = {};

        admin_update["status"] = $("#status_" + id).val();
        admin_update["admin_note"] = $("#admin_note_" + id).val();

        this.httpService.put("http://localhost:8080/UpdateTimesheetNote/" + id, admin_update)
            .toPromise()
            .then(response => {
                if (response["id"] != 0) {
                    $.notify("Record updated sucessfully!", "success");
                }
            },
                (err: HttpErrorResponse) => { console.log(err) }
            ).catch();
    }
}
