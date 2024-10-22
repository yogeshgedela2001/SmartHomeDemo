import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Import Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select'; // If you plan to use dropdowns
import { MatDatepickerModule } from '@angular/material/datepicker'; // If you plan to use datepickers
import { MatNativeDateModule } from '@angular/material/core'; // If you use MatDatepickerModule
import { MatDialogModule } from '@angular/material/dialog'; // Import for modal dialogs
import { MatToolbarModule } from '@angular/material/toolbar'; // Import for toolbar

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DevicesComponent } from './components/devices/devices.component';
import { TimeFormatPipe } from './time-format.pipe';
import { AddDeviceModalComponent } from './add-device-modal/add-device-modal.component';
import { EditDeviceModalComponent } from './edit-device-modal/edit-device-modal.component'; // Importing EditDeviceModalComponent

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        DashboardComponent,
        DevicesComponent,
        TimeFormatPipe,
        AddDeviceModalComponent,
        EditDeviceModalComponent, // Registering the EditDeviceModalComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatInputModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule, // Include if you are using dropdowns
        MatDatepickerModule, // Include if you are using datepickers
        MatNativeDateModule, // Include if you are using datepickers
        MatDialogModule, // Include this for dialog functionality
        MatToolbarModule, // Include this for the toolbar
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
