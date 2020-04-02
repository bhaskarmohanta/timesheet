import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http"
import { HttpErrorResponse } from "@angular/common/http"
import { AuthenticationService } from '../service/authentication.service';
// import { moment } from '../../assets/js/moment';
import { from } from 'rxjs';

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

  days: any[];
  weekDays: any[];
  months: any[];
  currentMonth: number;
  employeeData: any[];
  currentEmployee: string;
  from_date: string;
  to_date: string;
  ngOnInit(): void {

    this.months = [
      { "id": 1, "month": "Jan" },
      { "id": 2, "month": "Feb" },
      { "id": 3, "month": "Mar" },
      { "id": 4, "month": "Apr" },
      { "id": 5, "month": "May" },
      { "id": 6, "month": "Jun" },
      { "id": 7, "month": "Jul" },
      { "id": 8, "month": "Aug" },
      { "id": 9, "month": "Sep" },
      { "id": 10, "month": "Oct" },
      { "id": 11, "month": "Nov" },
      { "id": 12, "month": "Dec" }
    ];
    this.days = [
      { "id": 1, "day": "Mon" },
      { "id": 1, "day": "Tue" },
      { "id": 1, "day": "Wed" },
      { "id": 1, "day": "Thu" },
      { "id": 1, "day": "Fri" },
      { "id": 1, "day": "Sat" },
      { "id": 1, "day": "Sun" },
    ];

    let date: Date = new Date();
    this.currentMonth = date.getMonth() + 1;

    date.setDate(date.getDate() - date.getDay() + 0);
    this.from_date = date.getFullYear() + "-" + date.getMonth() + "-" + ("0" + date.getDate()).slice(-2);
    date = new Date();
    date.setDate(date.getDate() - date.getDay() + 6);
    this.to_date = date.getFullYear() + "-" + date.getMonth() + "-" + ("0" + date.getDate()).slice(-2);

    let weekdata = [];
    for (let i = 0; i < this.days.length; i++) {
      let day = {};
      day["day"] = i + 1;
      day["name"] = this.days[i]["day"];
      date = new Date();
      date.setDate(date.getDate() - date.getDay() + i).toString()
      day["date"] = date.getDate() + "-" + this.months[date.getMonth()]['month'] + "-" + date.getFullYear();

      weekdata[i] = day;
    }
    this.weekDays = weekdata;
    console.log(this.weekDays);

    this.addProject();

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

  loadData: any[];
  projectList: any[];
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

    this.loadData = null;
    this.projectList = null;
    this.dataDetails = null;
    this.totalProjectHrs = [];

    this.httpService.get("http://localhost:8080/ListProjects").subscribe(
      data => {
        this.projectList = data as any[];
      },
      (err: HttpErrorResponse) => {
        $("#reportsOf").html(
          '<div class="alert alert-danger"><strong>No data!</strong> No matched data found for this given values... </div>'
        );
      }
    );

    this.httpService.get("http://localhost:8080/ListTimesheets").subscribe(
      data => {
        this.loadData = data as any[];


        console.log(this.loadData);
        // // Get all data
        // for (let i = 0; i < this.loadData.length; i++) {
        //   let localSubLink = generateSubLink + this.loadData[i]["date"] + ".json";
        //   this.httpService.get(localSubLink).subscribe(
        //     data => {
        //       console.log("Into AJAX  " + i + ": " + localSubLink);
        //       this.expandedData[i] = data as any[];
        //       let count = 0;
        //       while (count < 7) {
        //         this.dataDetails = this.expandedData[i][count]["working"] as any[];
        //         for (let i = 0; i < this.dataDetails.length; i++) {
        //           if (this.totalProjectHrs[i] == null) {
        //             this.totalProjectHrs[i] = 0;
        //           }
        //           this.totalProjectHrs[i] += this.dataDetails[i]["hrs"];
        //         }
        //         count++;
        //       }
        //       console.log("   |-- " + i);
        //     },
        //     (err: HttpErrorResponse) => {
        //       $.notify(err);
        //     }
        //   );
        // }
        // // End of Get all data
      },
      (err: HttpErrorResponse) => {
        $("#reportsOf").html(
          '<div class="alert alert-danger"><strong>No data!</strong> No matched data found for this given values... </div>'
        );
      }
    );
  }

  expandedData: any[];
  expandedDataView: string;
  dataDetails: any[];
  totalProjectHrs: Array<number>;
  expand_week_view(id) {
    this.expandedDataView = id;
    this.expandedData = null;
    // this.dataDetails = null;
    this.totalProjectHrs = [];

    if ($("#btn_week_" + id).val() == 0) {
      $("#btn_week_" + id).val(1);

      $("#btn_week_" + id).removeClass("btn-success");
      $("#btn_week_" + id).addClass("btn-warning");
      $("#span_week_" + id).removeClass("fa fa-plus-circle");
      $("#span_week_" + id).addClass("fa fa-minus-square-o");

      // Get All Expanded Data
      // let localSubLink = generateSubLink + file + ".json";
      // this.httpService.get(localSubLink).subscribe(
      //   data => {
      //     this.expandedData = data as any[];
      //     var count = 0;

      //     while (count < 7) {
      //       this.dataDetails = this.expandedData[count]["working"] as any[];
      //       for (let i = 0; i < this.dataDetails.length; i++) {
      //         if (this.totalProjectHrs[i] == null) {
      //           this.totalProjectHrs[i] = 0;
      //         }
      //         this.totalProjectHrs[i] += this.dataDetails[i]["hrs"];
      //       }
      //       count++;
      //     }
      //   },
      //   (err: HttpErrorResponse) => {
      //     $.notify(err);
      //   }
      // );

    } else {
      $("#btn_week_" + id).val(0);
      $("#btn_week_" + id).removeClass("btn-warning");
      $("#btn_week_" + id).addClass("btn-success");
      $("#span_week_" + id).removeClass("fa fa-minus-square-o");
      $("#span_week_" + id).addClass("fa fa-plus-circle");

      $("#detailed_week_view_" + id).html("");
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

    this.httpService.get("../../assets/data/ProjectNames.json").subscribe(
      data => {
        this.projectName = data as any[];

        var pData = '<div id="project_' + this.project_no + '" class="addProjectWorking col-md-2">' +
          '<select class="form-control" id = "projectName_' + this.project_no + '" name = "projectName_' + this.project_no + '" onchange = "updateProjectName(' + this.project_no + ')" >' +
          '<option selected value="0"> Select </option>';

        for (let i = 0; i < this.projectName.length; i++) {
          pData += '<option value="' + this.projectName[i]["id"] + '">' + this.projectName[i]["name"] + '</option>';
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
        // $.notify(err);
        console.log(err);
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
    console.log(data);

    let project_details = {};
    let workingDetails = [];

    project_details["emp_ref_id"] = sessionStorage.getItem("userid");
    project_details["from_date"] = data[0]["value"];
    project_details["display_date"] = data[0]["value"];
    project_details["to_date"] = data[1]["value"];
    project_details["day"] = data[2]["value"];

    let count = 0;
    let outerCount = 0;
    let totalHrs = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i]["name"] == "project_id") {
        let workingDetailsElement = {};

        workingDetailsElement["id"] = count + 1;
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
    console.log([project_details]);


    // this.httpService.post<project_details>("http://localhost:8080/save_timesheet", timesheet);
  }

  detailed_view(id) {
    var checkBox = document.getElementById(
      "data_expanded_view_" + id
    )! as HTMLInputElement;
    if (checkBox.checked == true) {
      $(".detailed_view" + id).show();
    } else {
      $(".detailed_view" + id).hide();
    }
  }
}
