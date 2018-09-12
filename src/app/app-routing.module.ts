import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { EditBookComponent } from './components/edit-book/edit-book.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { AdminGuard } from './core/admin.guard';
import { CanReadGuard } from './core/can-read.guard';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [CanReadGuard] },
  { path: 'book-details/:id', component: BookDetailsComponent, canActivate: [CanReadGuard] },
  { path: 'edit-book/:id', component: EditBookComponent, canActivate: [AdminGuard] },
  { path: 'add-book', component: AddBookComponent, canActivate: [AdminGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
