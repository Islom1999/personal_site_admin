import { Routes } from '@angular/router'
import { SpCoursesComponent } from './sp-courses.component'
import { SpCoursesFormComponent } from './sp-courses-form/sp-courses-form.component'

export default [
  {
    path: '',
    component: SpCoursesComponent,
  },
  {
    path: 'add',
    component: SpCoursesFormComponent,
  },
  {
    path: 'edit/:id',
    component: SpCoursesFormComponent,
  },
] as Routes