import { Component, OnInit, Input } from '@angular/core';
import { StudentDetalis } from 'src/app/interfaces/student';

@Component({
  selector: 'app-add-students',
  templateUrl: './add-students.component.html',
  styleUrls: ['./add-students.component.css']
})
export class AddStudentsComponent implements OnInit {
  @Input()
  student: StudentDetalis;
  constructor() {}

  ngOnInit() {}
}
