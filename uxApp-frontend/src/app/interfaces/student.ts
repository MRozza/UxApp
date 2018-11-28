import { MajorSkill } from './student';
import { Options } from 'ng5-slider';
export interface StudentDetalis {
  courseCode: string;
  studentId: string;
  topicOfPresentation: string;
  semester: string;
  scale: number | null;
  contentStructureIdeasTotal: any;
  languageAndDeliveryTotal: any;
  technicalsTotal: any;
  totalOverAll: number;
  maximumAllowedMark: number;
  MajorSkills: MajorSkill[];
  name: string;
  grader: string;
}
export interface MajorSkill {
  Id: number;
  TotalScored: number;
  Title: string;
  SkillTotal: number;
  Skills: Skill[];
}
export interface Skill {
  Id: number;
  Name: string;
  Total: number;
  Grades: Grade[];
  options: Options; // to hold slider options
  Marked: boolean;
  Enabled: boolean;
}
export interface Grade {
  Name: string;
  Grade: number;
  Desc: string;
  Selected: boolean;
}

// hold previously edited data
export interface Setting {
  courseCode: string;
  semester: string;
  scale: number | null;
  majorSkills: MajorSkill[];
}
