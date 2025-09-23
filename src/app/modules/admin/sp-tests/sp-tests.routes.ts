import { Routes } from '@angular/router'
import { SpTestsComponent } from './sp-tests.component'
import { SpTestsFormComponent } from './sp-tests-form/sp-tests-form.component'

export default [
  {
    path: '',
    component: SpTestsComponent,
  },
  {
    path: 'add',
    component: SpTestsFormComponent,
  },
  {
    path: 'edit/:id',
    component: SpTestsFormComponent,
  },
] as Routes