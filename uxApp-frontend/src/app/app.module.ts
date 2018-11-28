import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng5SliderModule } from 'ng5-slider';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faAngleDown,
  faAngleUp,
  faArrowAltCircleDown,
  faArrowAltCircleUp,
  faPaperclip
} from '@fortawesome/free-solid-svg-icons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AddStudentsComponent } from './components/add-students/add-students.component';
import { Globals } from './globals';
import { DocumentBuilderComponent } from './components/document-builder/document-builder.component';
import { GradeStudentComponent } from './components/grade-student/grade-student.component';
import { RouterModule, Routes } from '@angular/router';
import { AddedStudentsParentComponent } from './components/added-students-parent/added-students-parent.component';
import { StartComponent } from './components/start/start.component';
import { SkillsMatrixComponent } from './components/skills-matrix/skills-matrix.component';

library.add(
  faAngleDown,
  faAngleUp,
  faArrowAltCircleDown,
  faArrowAltCircleUp,
  faPaperclip
);
const appRoutes: Routes = [
  { path: 'start', component: StartComponent },
  { path: '', redirectTo: '/start', pathMatch: 'full' },
  { path: 'grading-student', component: AddedStudentsParentComponent }
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    AddedStudentsParentComponent,
    AddStudentsComponent,
    DocumentBuilderComponent,
    GradeStudentComponent,
    StartComponent,
    SkillsMatrixComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    NgbModule,
    Ng5SliderModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [Globals],
  bootstrap: [AppComponent]
})
export class AppModule {}
