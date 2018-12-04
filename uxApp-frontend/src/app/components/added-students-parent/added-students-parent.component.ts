import { DataService } from './../../services/data-service.service';
import { MajorSkill } from './../../interfaces/student';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  CallApiService,
  ApiReq,
  Attachment
} from './../../services/call-api.service';
import { StudentDetalis } from 'src/app/interfaces/student';
import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Globals } from 'src/app/globals';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-added-students-parent',
  templateUrl: './added-students-parent.component.html',
  styleUrls: ['./added-students-parent.component.css']
})
export class AddedStudentsParentComponent implements OnInit {
  manualRefresh = new EventEmitter<void>();
  public emailFormParent = <FormGroup>{};
  public req: ApiReq = <ApiReq>{};
  isValid = false;
  constructor(
    public global: Globals,
    private router: Router,
    private dataService: DataService,
    private call: CallApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.req.attachments = [];
    if (!this.global.students || this.global.students.length === 0) {
      this.router.navigate(['/start']);
      return;
    }
    this.emailFormParent = new FormGroup({
      email: new FormControl(this.req.to, [
        Validators.required,
        Validators.email
      ]),
      body: new FormControl(this.req.text, [Validators.required])
    });
    let index = 0;
    // fill array with starting json data
    this.global.students.map(async student => {
      index++;
      student.totalOverAll = 0;
      student.name = `Student ${index}`;
      // get data from json
      // all same degree?
      // student.MajorSkills = this.global.setting.majorSkills;
      // else
      student.MajorSkills = JSON.parse(
        JSON.stringify(this.global.setting.majorSkills)
      );

      // iterate through major skills to calculate data and init slider options
      // todo: add to a method later
      student.MajorSkills.map(majorSkill => {
        majorSkill.SkillTotal = 0;
        majorSkill.Skills = majorSkill.Skills.filter(Skill => Skill.Enabled);
        majorSkill.Skills.map(skill => {
          majorSkill.SkillTotal += skill.Total;

          // setting slider options for each skill
          const array: any[] = [];
          skill.Grades.map(grade =>
            array.push({
              value: grade.Grade,
              legend: grade.Name,
              desc: grade.Desc
            })
          );
          skill.options = {
            showTicksValues: true,
            stepsArray: array,
            ticksTooltip: (v: number): string => {
              return array[v].desc;
            }
          };
        });
        // since we start with perfect grades, totalscore=maximum marks
        majorSkill.TotalScored = majorSkill.SkillTotal;
        student.totalOverAll += majorSkill.TotalScored;
      });
      student.maximumAllowedMark = student.totalOverAll;
    });
  }

  public beforeChange(event: NgbTabChangeEvent) {
    this.manualRefresh.emit();
  }

  validateStudent(student: StudentDetalis): boolean {
    if (
      !student.studentId ||
      !student.courseCode ||
      !student.semester ||
      !student.topicOfPresentation
    ) {
      this.toastr.error(
        `Enter ${student.name} and course details`,
        'Invalid details!'
      );
      return false;
    }
    return true;
  }

  emailAll() {
    this.req.to = this.emailFormParent.value.email;
    this.req.text = this.emailFormParent.value.body;
    if (this.emailFormParent.valid) {
      const studentIds = this.global.students.map(student => student.studentId);
      console.log(studentIds);

      if (studentIds.length === 0) {
        this.toastr.success(`All students data are invalid`, 'Invalid Data!');
        return;
      }
      this.req.subject = `Result of students: ${studentIds}`;
      this.call.sendEmail(this.req).subscribe((res: any) => {
        this.toastr.success('Email has been sent successfully!', 'Success!');
        console.log(res);
      });
    } else {
      this.toastr.error(
        'Email form fields were not entered correctly',
        'Invalid Email form!'
      );
    }
  }

  downloadAll() {
    this.global.students.map(student => {
      if (this.validateStudent(student)) {
        const blob = new Blob(['\ufeff', this.getHtml(student)], {
          type: 'application/msword'
        });

        // Specify file name
        const filename = `${student.studentId}-${student.semester}-${
          student.courseCode
        }-${student.topicOfPresentation}.doc`;

        // Create download link element
        const downloadLink = document.createElement('a');

        document.body.appendChild(downloadLink);

        if (navigator.msSaveOrOpenBlob) {
          navigator.msSaveOrOpenBlob(blob, filename);
        } else {
          // Create a link to the file
          downloadLink.href = this.getUrl(student);

          // Setting the file name
          downloadLink.download = filename;

          // triggering the function
          downloadLink.click();
        }
        document.body.removeChild(downloadLink);
      }
    });
  }
  getHtml(student: StudentDetalis): string {
    const preHtml = `<html><head><meta http-equiv=Content-Type content="text/html; charset=windows-1252">
<meta name=Generator content="Microsoft Word 15 (filtered)"></head>
<body lang=EN-NZ style='tab-interval:36.0pt'>`;
    const postHtml = '</body></html>';
    return (
      preHtml +
      document.getElementById(`htmlData${student.studentId}`).innerHTML +
      postHtml
    );
  }

  getAttachment() {
    this.global.students.forEach(student => {
      if (!this.validateStudent(student)) {
        this.isValid = false;
        return;
      }
    });
    this.isValid = true;
    this.req.attachments = [];
    this.global.students.map(student => {
      if (this.validateStudent(student)) {
        const attachment = <Attachment>{};
        attachment.attachmentData = this.getUrl(student);
        attachment.attachmentName = `${student.studentId}-${student.semester}-${
          student.courseCode
        }-${student.topicOfPresentation}.doc`;
        this.req.attachments.push(attachment);
      } else {
        this.toastr.error(
          `${student.name} Data is invalid and cannot be downloaded or emailed`
        );
      }
    });
  }

  getUrl(student: StudentDetalis): string {
    const html = this.getHtml(student);
    // Specify link url
    return (
      'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html)
    );
  }
  reset() {
    window.location.reload();
  }
}
