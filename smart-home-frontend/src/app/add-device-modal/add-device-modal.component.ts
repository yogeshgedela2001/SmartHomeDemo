import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Device } from '../models/device.model'; 
import { UserService } from '../services/user.service'; 
@Component({
  selector: 'app-add-device-modal',
  templateUrl: './add-device-modal.component.html',
  styleUrls: ['./add-device-modal.component.css'],
})
export class AddDeviceModalComponent {

  newDevice: Device = {
    deviceId: 0,
    name: '',
    startTime: '',
    endTime: '',
    status: false,
    isActive: false,
    ownerId: 0, 
  };

  constructor(
    public dialogRef: MatDialogRef<AddDeviceModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private userService: UserService 
  ) {

    const currentUser = this.userService.getCurrentUser();
    this.newDevice.ownerId = currentUser?.id ?? 0; 
  }

  onAddDevice() {
    this.dialogRef.close(this.newDevice); 
  }

  onCancel(): void {
    this.dialogRef.close(); 
  }
}
