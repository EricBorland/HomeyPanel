import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetupComponent } from './setup/setup.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [{
  path: 'setup',
  children: [{
    path: '',
    outlet: 'body',
    component: SetupComponent
  }]
}, {
  path: 'home',
  children: [{
    path: '',
    outlet: 'header',
    component: HeaderComponent
  }, {
    path: '',
    outlet: 'menu',
    component: MenuComponent
  }, {
    path: '',
    outlet: 'body',
    component: HomeComponent
  }]
}, {
  path: 'settings',
  children: [{
    path: '',
    outlet: 'header',
    component: HeaderComponent
  }, {
    path: '',
    outlet: 'menu',
    component: MenuComponent
  }, {
    path: '',
    outlet: 'body',
    component: SettingsComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
