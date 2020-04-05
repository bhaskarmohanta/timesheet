import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http"
import { HttpErrorResponse } from "@angular/common/http"
import { AuthenticationService } from '../service/authentication.service';
import * as moment from 'moment';

declare var $: any;

var generateSubLink = "";
var generateLink = "";

@Component({
  selector: "app-viewts",
  templateUrl: "./viewts.component.html",
  styleUrls: ["./viewts.component.css"]
})

export class ViewtsComponent implements OnInit {

  constructor(private httpService: HttpClient, private loginService: AuthenticationService) {//private api: ApiService
  }

  // timesheet: timesheetData[];
  days: any[];
  weekDays: any[];
  months: any[];
  currentMonth: number;
  currentYear: number;
  employeeData: any[];
  currentEmployee: string;
  from_date: string;
  to_date: string;
  userRole: string;
  leaveTypes: any[];
  projectListDB: any[];
  dataCheck: string[];
  ngOnInit(): void {

    this.userRole = sessionStorage.getItem('userRole');
    this.months = [
      { "id": 0, "month": "Jan" },
      { "id": 1, "month": "Feb" },
      { "id": 2, "month": "Mar" },
      { "id": 3, "month": "Apr" },
      { "id": 4, "month": "May" },
      { "id": 5, "month": "Jun" },
      { "id": 6, "month": "Jul" },
      { "id": 7, "month": "Aug" },
      { "id": 8, "month": "Sep" },
      { "id": 9, "month": "Oct" },
      { "id": 10, "month": "Nov" },
      { "id": 11, "month": "Dec" }
    ];
    this.days = [
      { "id": 1, "day": "Mon" },
      { "id": 2, "day": "Tue" },
      { "id": 3, "day": "Wed" },
      { "id": 4, "day": "Thu" },
      { "id": 5, "day": "Fri" },
      { "id": 6, "day": "Sat" },
      { "id": 7, "day": "Sun" },
    ];

    this.leaveTypes = [
      { id: 1, name: "SL" },
      { id: 2, name: "CL" },
      { id: 3, name: "UL" },
      { id: 4, name: "EL" },
      { id: 5, name: "Holiday" },
      { id: 6, name: "Other" },
    ];

    let date: Date = new Date();
    this.currentMonth = date.getMonth();
    this.currentYear = date.getFullYear();

    this.httpService.get("http://localhost:8080/ListProjects").subscribe(
      data => {
        this.projectListDB = data as any[];
      },
      (err: HttpErrorResponse) => {
        $("#reportsOf").html(
          '<div class="alert alert-danger"><strong>No data!</strong> No matched data found for this given values... </div>'
        );
      }
    );

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

  checkData() {
    this.addProject();

    let date: Date = new Date();

    if (date.getDay() == 0) {
      date.setDate(date.getDate() - 6);
    } else {
      date.setDate(date.getDate() - (date.getDay() - 1));
    }

    this.from_date = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);

    let weekdata = [];
    for (let i = 0; i < this.days.length; i++) {
      let day = {};
      day["id"] = i + 1;
      day["day"] = this.days[i]["day"];
      // date = new Date();
      day["date"] = date.getDate() + "-" + this.months[date.getMonth()]['month'] + "-" + date.getFullYear();
      date.setDate(date.getDate() + 1).toString()
      day["month"] = this.currentMonth;
      day["year"] = this.currentYear;
      weekdata[i] = day;
    }

    date.setDate(date.getDate() - 1);
    this.to_date = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);

    //>>>> CHECK EXISTING RECORDS
    let from_date = moment(this.from_date, "YYYY-MM-DD").format('YYYYMMDD');
    let to_date = moment(this.to_date, "YYYY-MM-DD").format('YYYYMMDD');

    let url = "http://localhost:8080/CheckDataTimesheet/" + $("#employee").val() + "/" + from_date + "/" + to_date;

    this.httpService.get(url).subscribe(
      data => {
        this.dataCheck = data as string[];
        weekdata.forEach(element => {
          if (this.dataCheck.includes(element.day)) {
            element.status = 1;
          } else {
            element.status = 0;
          }
        });
      },
      (err: HttpErrorResponse) => {
        $("#reportsOf").html(
          '<div class="alert alert-danger"><strong>No data!</strong> No matched data found for this given values... </div>'
        );
      }
    );
    //>>>> END

    this.weekDays = weekdata;
  }

  loadParent: any[];
  loadChild: any[];
  recordsPerMonth: string[];
  loadList() {
    if ($("#employee").val() == 0) {
      $.notify("Select an employee");
      $("#employee").focus();
      return;
    }
    if ($("#year").val() == 0) {
      $.notify("Choose a Year");
      $("#year").focus();
      return;
    }
    if ($("#month").val() == 0) {
      $.notify("Choose a Month");
      $("#month").focus();
      return;
    }

    this.loadParent = null;
    this.dataDetails = null;
    this.totalProjectHrs = [];

    let url = "http://localhost:8080/ListTimesheets/" + $("#year").val() + "/" + (parseInt($("#month").val()) + 1) + "/" + $("#employee").val() + "/" + $("#status").val();
    this.httpService.get(url).subscribe(
      data => {
        this.loadParent = data as any[];
        if (this.loadParent.length <= 0) {
          $("#reportsOf").html(
            '<div class="alert alert-danger"><strong>No data!</strong> No matched data found for this given values... </div>'
          );
          return;
        }

        let childData = [];
        let countWeeks = [];
        let count = 0;
        for (let i = 0; i < this.loadParent.length; i++) {

          if (!countWeeks.includes(this.loadParent[i]["from_date"])) {

            let pushData = {};
            pushData["id"] = count;
            pushData["from_date"] = this.loadParent[i]["from_date"];
            pushData["to_date"] = this.loadParent[i]["to_date"];
            pushData["workingDetails"] = this.loadParent[i]["workingDetails"];

            // >> STARTING OF PROJECT COUNT TOTAL HOURS SECTION
            let countTotalProjectHrs = [];
            let projectList = [];
            for (let j = 0; j < pushData["workingDetails"].length; j++) {

              if (projectList.includes(pushData["workingDetails"][j]["project_id"])) {
                let totalProjectHrs = {};
                totalProjectHrs["project_id"] = pushData["workingDetails"][j]["project_id"];
                totalProjectHrs["total_hrs"] = pushData["workingDetails"][j]["working_hrs"];
                projectList.push(pushData["workingDetails"][j]["project_id"]);

                countTotalProjectHrs[pushData["workingDetails"][j]["project_id"]] = totalProjectHrs;
              }
            }
            // >> ENDING OF PROJECT COUNT TOTAL HOURS SECTION

            countWeeks.push(this.loadParent[i]["from_date"]);
            childData[count] = pushData;
            count++;
          }
        }
        this.loadChild = childData;
      },
      (err: HttpErrorResponse) => {
        $("#reportsOf").html(
          '<div class="alert alert-danger"><strong>No data!</strong> Error in network connection... </div>'
        );
      }
    );
  }

  expandedData: any[];
  dataDetails: any[];
  totalProjectHrs: Array<number>;
  expand_week_view(id) {

    if ($("#btn_week_" + id).val() == 0) {
      $("#btn_week_" + id).val(1);

      $("#btn_week_" + id).removeClass("btn-success");
      $("#btn_week_" + id).addClass("btn-warning");
      $("#span_week_" + id).removeClass("fa fa-plus-circle");
      $("#span_week_" + id).addClass("fa fa-minus-square-o");

      $("#detailed_week_view_" + id).show();
    } else {
      $("#btn_week_" + id).val(0);
      $("#btn_week_" + id).removeClass("btn-warning");
      $("#btn_week_" + id).addClass("btn-success");
      $("#span_week_" + id).removeClass("fa fa-minus-square-o");
      $("#span_week_" + id).addClass("fa fa-plus-circle");

      $("#detailed_week_view_" + id).hide();
    }
  }

  projectName: any[];
  project_no: number;
  addProject() {
    this.project_no = $("#btnAddProject").val();
    this.project_no++;

    if (this.project_no >= 4) {
      $("#btnAddProject").attr("disabled", "disabled");
    }

    this.httpService.get("http://localhost:8080/ListProjects").subscribe(
      data => {
        this.projectName = data as any[];

        var pData = '<div id="project_' + this.project_no + '" class="addProjectWorking col-md-2">' +
          '<select class="form-control" id = "projectName_' + this.project_no + '" name = "projectName_' + this.project_no + '" onchange = "updateProjectName(' + this.project_no + ')" >' +
          '<option selected value="0"> Select </option>';

        for (let i = 0; i < this.projectName.length; i++) {
          pData += '<option value="' + this.projectName[i]["id"] + '">' + this.projectName[i]["project_name"] + '</option>';
        }

        pData += '</select>' +
          '<button onclick="delete_project(' + this.project_no + ')" type="button" class="close">&times;</button>' +
          '</div>';
        $("#add_project").append(pData);

        $("#btnAddProject").val(this.project_no);

        for (var i = 1; i <= 7; i++) {
          var projectDetails = '<div class="project_details" id="project_details_' + this.project_no + '' + i + '">' +
            '<div class="col-md-3 working-details text-center">' +
            '<input type="hidden" name="project_id" id="project_name_input_' + this.project_no + '' + i + '">' +
            '<input type="text" name="working_hrs" id="whrs_' + this.project_no + '' + i + '" class="form-control" placeholder="Hrs.">' +
            '<input type="hidden" name="working_cmnt" id="working_cmnt_' + this.project_no + '' + i + '">' +
            '<span class="fa fa-pencil-square fa-lg" onclick="openComment(' + this.project_no + ',' + i + ')"></span>' +
            '</div>' +
            '</div>';

          $("#working_" + i).append(projectDetails);
        }
      },
      (err: HttpErrorResponse) => {
      }
    );
  }

  openComment(id) {
    $.confirm({
      title: 'Write your comment here..',
      content: '' +
        '<br>' +
        '<form action="" class="formName">' +
        '<div class="form-group">' +
        '<textarea rows=5  id="commentForAll" class="name form-control" required />' +
        '</div>' +
        '</form>',
      buttons: {
        formSubmit: {
          text: 'Save',
          btnClass: 'btn-blue',
          action: function () {
            var name = this.$content.find('.name').val();
            $("#non_working_cmnt_" + id).val($("#commentForAll").val());
          }
        },
        cancel: function () {
          //close
        },
      },
      onContentReady: function () {
        // bind to events
        var jc = this;
        this.$content.find('form').on('submit', function (e) {
          // if the user submits the form by pressing enter in the field.
          e.preventDefault();
          jc.$$formSubmit.trigger('click'); // reference the button and click it
        });
      }
    });
  }

  saveData(id) {

    let btnval = $("#btnAddProject").val();
    for (let i = 1; i <= btnval; i++) {
      if ($("#projectName_" + i).val() == 0) {
        $.notify("Select an Project name");
        $("#projectName_" + i).focus();
        return;
      }
      if ($("#whrs_" + i + '' + id).val() == "") {
        $.notify("Mention the No. of Hours worked on the project!");
        $("#whrs_" + i + '' + id).focus();
        return;
      }
    }
    if ($("#non_working_leave_" + id).val() != 0) {
      if ($("#hrs_" + id).val() == "") {
        $.notify("Leave hours to be mentioned");
        $("#hrs_" + id).focus();
        return;
      }
    }

    var data = $("#form_" + id).serializeArray();

    let project_details = {};
    let workingDetails = [];

    project_details["emp_ref_id"] = sessionStorage.getItem("userid");
    project_details["display_date"] = moment(data[0]["value"], "DD-MMM-YYYY").format('DD-MMM-YYYY');
    project_details["from_date"] = moment(data[1]["value"], "YYYY-MM-DD").format('YYYY-MM-DD');
    project_details["to_date"] = moment((data[2]["value"]), "YYYY-MM-DD").format('YYYY-MM-DD');
    project_details["day"] = data[3]["value"];

    let count = 0;
    let outerCount = 0;
    let totalHrs = 0;
    for (let i = 4; i < data.length; i++) {
      if (data[i]["name"] == "project_id") {
        let workingDetailsElement = {};

        // workingDetailsElement["id"] = count + 1;
        workingDetailsElement["project_id"] = data[i]["value"];
        workingDetailsElement["working_hrs"] = data[i + 1]["value"];
        workingDetailsElement["cmnt"] = data[i + 2]["value"];
        workingDetailsElement["status"] = true;

        totalHrs += parseInt(workingDetailsElement["working_hrs"]);
        i += 2;

        workingDetails[count] = workingDetailsElement;
        count++;
        outerCount = i + 1;
      }
    }
    project_details["workingDetails"] = workingDetails;

    project_details["non_working_id"] = data[outerCount]["value"];
    project_details["non_working_hrs"] = data[outerCount + 1]["value"];
    project_details["non_working_cmnt"] = data[outerCount + 2]["value"];
    project_details["total_hrs"] = totalHrs;
    project_details["month"] = this.currentMonth;
    project_details["year"] = this.currentYear;

    this.httpService.post("http://localhost:8080/timesheet", project_details)
      .toPromise()
      .then(res => {
        if (res["id"] != 0) {
          $.notify("Record saved sucessfully!", "success");
        }
      },
        (err: HttpErrorResponse) => { })
      .catch();
  }

  saveAdminNote(id) {

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
        (err: HttpErrorResponse) => { }
      ).catch();
  }
}