import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule, HttpClient, HttpClientJsonpModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminComponent } from './components/admin/admin.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { EditBookComponent } from './components/edit-book/edit-book.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { FirebaseService } from './services/firebase.service';
import { UtilService } from './services/util.service';
import { MaterialModule } from './modules/material.module';
import { FilterPipe } from './modules/filter.pipe';
import { CoreModule } from './core/core.module';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AuthService } from './core/auth.service';
import { DialogBoxComponent } from './components/dialog-box/dialog-box.component';
import { ShareButtonsModule } from '@ngx-share/buttons';
import 'rxjs/add/operator/take';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BookDetailsComponent,
    ProfileComponent,
    AdminComponent,
    FooterComponent,
    HeaderComponent,
    EditBookComponent,
    AddBookComponent,
    FilterPipe,
    DialogBoxComponent
  ],
  imports: [
    HttpClientModule,
    HttpClientJsonpModule,
    BrowserModule,
    MaterialModule,
    CoreModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    ShareButtonsModule.forRoot(),
    AngularFireAuthModule
  ],
  entryComponents: [
    DialogBoxComponent
  ],
  providers: [UtilService, FirebaseService, AuthService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule { }
