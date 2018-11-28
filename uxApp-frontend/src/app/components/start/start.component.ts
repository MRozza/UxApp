import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from './../../services/data-service.service';
import { MajorSkill, Setting, Skill } from './../../interfaces/student';
import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/globals';
import { Router } from '@angular/router';
import { StudentDetalis } from 'src/app/interfaces/student';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
  title = 'ux-grading-app';
  numberOfStudents = 1;
  sm = false; // set the semester for all students
  cc = false; // set the same course code for all students
  pt = false; // set the same presentation topic for all students
  sc = false; // set the same scale for all students
  presentationTopic = '';
  scale: number | null;
  courseCode = '';
  semester = '';
  grader = '';
  isNew = false;
  selectedSetting: Setting = <Setting>{};
  defaultSetting: Setting = <Setting>{};
  public skillForm = <FormGroup>{};
  majorSkillUpdating: MajorSkill;
  settings: Setting[] = [];
  isDefault = true;
  constructor(
    private global: Globals,
    private router: Router,
    private dataService: DataService,
    private toastr: ToastrService
  ) {}

  async ngOnInit() {
    this.skillForm = new FormGroup({
      skillName: new FormControl('', Validators.required),
      excellentDesc: new FormControl('', Validators.required),
      goodDesc: new FormControl('', Validators.required),
      fairDesc: new FormControl('', Validators.required),
      poorDesc: new FormControl('', Validators.required)
    });
    this.global.isEdit = false;
    await this.dataService.getJSON().subscribe(data => {
      this.defaultSetting.majorSkills = data;
      this.defaultSetting.majorSkills.forEach(majorSkill=>{
        majorSkill.Skills.forEach(skill=>{
          skill.Enabled=true;
        })
      })

      const settings = JSON.parse(localStorage.getItem('courseSettings'));
      if (settings) {
        this.settings = settings;
        console.log(this.settings);
      }
    });
  }
  selectTemplate(i: number) {
    // default, shouldn't be modified
    if (i === 101010) {
      this.selectedSetting = JSON.parse(JSON.stringify(this.defaultSetting));
      this.isDefault = true;
      return;
    }
    this.isDefault = false;
    this.selectedSetting = this.settings[i];
  }

  addStudents() {
    for (let i = 0; i < this.numberOfStudents; i++) {
      const student = <StudentDetalis>{};
      student.semester = this.semester;
      student.courseCode = this.courseCode || this.selectedSetting.courseCode;
      student.topicOfPresentation = this.presentationTopic;
      student.scale = this.scale || this.selectedSetting.scale;
      student.grader = this.grader;
      this.global.students.push(student);
    }
    console.log(this.global.students);
    if(!this.selectedSetting.majorSkills){
      this.selectedSetting=this.defaultSetting;
    }
    this.global.setting = this.selectedSetting;
    this.router.navigate(['/grading-student']);
  }

  populateForm(majorSkill: MajorSkill) {
    this.majorSkillUpdating = majorSkill;
  }

  addSkill(e: Event) {
    if (!this.skillForm.valid) {
      this.toastr.error('Skill details were not completed', 'Invalid details!');
      e.preventDefault();
      return;
    }
    const skill: Skill = <Skill>{};
    skill.Id = this.majorSkillUpdating.Skills.length + 1;
    skill.Enabled = true;
    skill.Name = this.skillForm.value.skillName;
    skill.Total = 4;
    skill.Grades = [];
    skill.Grades.push({
      Name: 'Excellent',
      Grade: 4,
      Selected: true,
      Desc: this.skillForm.value.excellentDesc
    });
    skill.Grades.push({
      Name: 'Good',
      Grade: 3,
      Selected: true,
      Desc: this.skillForm.value.goodDesc
    });
    skill.Grades.push({
      Name: 'Fair',
      Grade: 2,
      Selected: true,
      Desc: this.skillForm.value.fairDesc
    });
    skill.Grades.push({
      Name: 'Poor',
      Grade: 1,
      Selected: true,
      Desc: this.skillForm.value.poorDesc
    });

    this.majorSkillUpdating.Skills.push(skill);
    $('#addNewModal').modal('hide');
  }
  saveTemplate() {
    if (!this.selectedSetting.courseCode) {
      this.toastr.error('Course code is invalid', 'Invalid Data!');
      return;
    }
    if (this.isDefault) {
      if (this.settings.length >= 5) {
        this.toastr.error(
          'Sorry, user cannot have  more than five templates',
          'Operation aborted!'
        );
        return;
      }
      this.isDefault = false;
      this.settings.push(this.selectedSetting);
    }
    localStorage.setItem('courseSettings', JSON.stringify(this.settings));
  }
}
