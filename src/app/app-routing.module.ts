import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetupComponent } from './setup/setup.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';

const routes: Routes = [{
  path: 'setup',
  component: SetupComponent
}, {
  path: 'home',
  component: HomeComponent,
  children: [{
    path: '',
    outlet: 'header',
    component: HeaderComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
