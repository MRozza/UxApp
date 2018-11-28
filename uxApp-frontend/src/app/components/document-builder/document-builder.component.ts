import { StudentDetalis } from './../../interfaces/student';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-document-builder',
  templateUrl: './document-builder.component.html',
  styleUrls: ['./document-builder.component.css']
})
export class DocumentBuilderComponent implements OnInit {
  @Input()
  student: StudentDetalis;
  public _studentId: string;

  @Input()
  set studentId(value: string) {
    this._studentId = `htmlData${value}`;
    console.log(this._studentId);
  }
  constructor() {}

  ngOnInit() {}
}
