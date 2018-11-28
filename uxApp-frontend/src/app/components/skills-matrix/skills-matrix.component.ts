import { Skill, MajorSkill, StudentDetalis } from './../../interfaces/student';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-skills-matrix',
  templateUrl: './skills-matrix.component.html',
  styleUrls: ['./skills-matrix.component.css']
})
export class SkillsMatrixComponent implements OnInit {
  @Input()
  manualRefresh: EventEmitter<void>;
  @Input()
  majorSkill: MajorSkill;
  @Input()
  student: StudentDetalis;

  constructor() {}

  ngOnInit() {}

  onUserChange(skillSelected: Skill): void {
    // deselect all skill
    this.majorSkill.Skills.map(skill => {
      skill.Grades.map(grade => (grade.Selected = false));
    });
    // get grade by value
    const gradeSelected = skillSelected.Grades.filter(
      x => x.Grade === skillSelected.Total
    )[0];
    gradeSelected.Selected = true;
    let result = 0;
    this.majorSkill.Skills.map(skill => {
      result += skill.Total;
    });
    this.majorSkill.TotalScored = result;
    skillSelected.Marked=true;
    this.calculateStudentTotal();
  }
  markSkill(skill: Skill){
    skill.Marked=true;
  }
  calculateStudentTotal() {
    this.student.totalOverAll = 0;
    this.student.MajorSkills.map(majorSkill => {
      // to calculate maximum marks
      // majorSkill.Skills.length * 4 // since 4 = excellent
      this.student.totalOverAll += majorSkill.TotalScored;
    });
  }
}
