import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Device } from '../models/device.model'; // Adjust the import path as necessary
import { UserService } from '../services/user.service'; // Assuming you have a service to get the current user

@Component({
  selector: 'app-add-device-modal',
  templateUrl: './add-device-modal.component.html',
  styleUrls: ['./add-device-modal.component.css'],
})
export class AddDeviceModalComponent {
  // Initialize newDevice with ownerId set to 0 (or default value)
  newDevice: Device = {
    deviceId: 0,
    name: '',
    startTime: '',
    endTime: '',
    status: false,
    isActive: false,
    ownerId: 0, // Initialize with 0 or a default value
  };

  constructor(
    public dialogRef: MatDialogRef<AddDeviceModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // You can define a proper interface for data
    private userService: UserService // Inject the UserService to get the current user
  ) {
    // Set the ownerId to the current user's ID with fallback to 0
    const currentUser = this.userService.getCurrentUser();
    this.newDevice.ownerId = currentUser?.id ?? 0; // Fallback to 0 if undefined
  }

  onAddDevice() {
    this.dialogRef.close(this.newDevice); // Close the modal and pass the new device back
  }

  onCancel(): void {
    this.dialogRef.close(); // Just close the modal without any data
  }
}
