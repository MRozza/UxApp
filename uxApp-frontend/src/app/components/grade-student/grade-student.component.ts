import { Attachment } from './../../services/call-api.service';
import { MajorSkill } from './../../interfaces/student';
import { Globals } from '../../globals';
import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  ElementRef,
  ViewChild
} from '@angular/core';
import { ApiReq, CallApiService } from '../../services/call-api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbAlert, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { StudentDetalis } from '../../interfaces/student';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-grade-student',
  templateUrl: './grade-student.component.html',
  styleUrls: ['./grade-student.component.css']
})
export class GradeStudentComponent implements OnInit {
  @Input()
  student: StudentDetalis;
  @Input()
  manualRefresh: EventEmitter<void>;

  public req: ApiReq = <ApiReq>{};
  public url = '';
  public emailForm = <FormGroup>{};
  public isValid = false;
  public isVisible = false;
  activeTabNumber = 1;

  constructor(
    private call: CallApiService,
    private toastr: ToastrService,
    private global: Globals,
    private sanitizer: DomSanitizer
  ) {}

  async ngOnInit() {
    this.req.attachments = [];
    this.emailForm = new FormGroup({
      email: new FormControl(this.req.to, [
        Validators.required,
        Validators.email
      ]),
      body: new FormControl(this.req.text, [Validators.required])
    });
  }

  populateGeneralCalc() {
    this.student.totalOverAll =
      this.student.contentStructureIdeasTotal +
      this.student.languageAndDeliveryTotal +
      this.student.technicalsTotal;
  }

  skilChanged(event: NgbTabChangeEvent) {
    this.manualRefresh.emit();
  }

  getHtml(): string {
    const preHtml = `<html><head><meta http-equiv=Content-Type content="text/html; charset=windows-1252">
<meta name=Generator content="Microsoft Word 15 (filtered)"></head>
<body lang=EN-NZ style='tab-interval:36.0pt'>`;
    const postHtml = '</body></html>';
    return (
      preHtml +
      document.getElementById(`htmlData${this.student.studentId}`).innerHTML +
      postHtml
    );
  }

  getAttachment() {
    this.validateForm();
    if (this.isValid) {
      this.isVisible = !this.isVisible;
      const html = this.getHtml();
      // Specify link url
      this.url =
        'data:application/vnd.ms-word;charset=utf-8,' +
        encodeURIComponent(html);
      const attachment = <Attachment>{};
      attachment.attachmentData = this.url;
      attachment.attachmentName = `${this.student.studentId}-${
        this.student.semester
      }-${this.student.courseCode}-${this.student.topicOfPresentation}.doc`;
      this.req.attachments.push(attachment);
    }
  }

  validateForm(): boolean {
    this.isValid = true;
    if (
      !this.student.studentId ||
      !this.student.courseCode ||
      !this.student.semester ||
      !this.student.topicOfPresentation
    ) {
      this.toastr.error('Enter student and course details', 'Invalid details!');

      this.isValid = false;
      window.scrollTo(0, 0);
    }
    return this.isValid;
  }

  sendEmail() {
    console.warn(this.emailForm.value);
    if (this.validateForm()) {
      if (this.emailForm.valid) {
        this.req.to = this.emailForm.value.email;
        this.req.text = this.emailForm.value.body;
        this.req.subject = `Result of student number: ${
          this.student.studentId
        }`;
        this.call.sendEmail(this.req).subscribe((res: any) => {
          this.toastr.success('Email has been sent successfully!', 'Success!');
        });
      } else {
        this.toastr.error(
          'Email form fields were not entered correctly',
          'Invalid Email form!'
        );
      }
    }
  }

  Export2Doc() {
    this.validateForm();
    if (this.isValid) {
      const html = this.getHtml();
      // Specify link url
      this.url =
        'data:application/vnd.ms-word;charset=utf-8,' +
        encodeURIComponent(html);
      const blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
      });

      // Specify file name
      const filename = `${this.student.studentId}-${this.student.semester}-${
        this.student.courseCode
      }-${this.student.topicOfPresentation}.doc`;

      // Create download link element
      const downloadLink = document.createElement('a');

      document.body.appendChild(downloadLink);

      if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, filename);
      } else {
        // Create a link to the file
        downloadLink.href = this.url;

        // Setting the file name
        downloadLink.download = filename;

        // triggering the function
        downloadLink.click();
      }
      document.body.removeChild(downloadLink);
    }
  }
  getAttachmentContent(data): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(data);
  }
}
