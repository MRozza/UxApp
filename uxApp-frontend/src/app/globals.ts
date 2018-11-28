import { StudentDetalis, Setting } from './interfaces/student';
import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
  students: StudentDetalis[] = [];
  isEdit = false;
  setting: Setting = <Setting>{};
}
