import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';


const routes: Routes = [{
  path: 'home',
  children: [{
    path: '',
    component: HomeComponent,
    outlet: 'body'
  }, {
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
