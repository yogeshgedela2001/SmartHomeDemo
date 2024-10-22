import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Device } from '../models/device.model';
import { DeviceService } from '../services/device.service';

@Component({
    selector: 'app-edit-device-modal',
    templateUrl: './edit-device-modal.component.html',
    styleUrls: ['./edit-device-modal.component.css']
})
export class EditDeviceModalComponent implements OnInit {
    editedDevice: Device; // Renamed from device to editedDevice

    constructor(
        public dialogRef: MatDialogRef<EditDeviceModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { device: Device }, // Injecting device data
        private deviceService: DeviceService // Inject the device service
    ) {
        this.editedDevice = { ...data.device }; // Copy device data for editing
    }

    ngOnInit(): void {}

    // Method to save the edited device and close the modal
    onEditDevice() {
        this.dialogRef.close(this.editedDevice); // Close the dialog and return the edited device
    }

    // Method to cancel editing
    onCancel() {
        this.dialogRef.close(); // Just close the dialog
    }
}
