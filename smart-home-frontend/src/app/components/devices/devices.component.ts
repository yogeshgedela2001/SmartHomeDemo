import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../../services/device.service';
import { Device } from '../../models/device.model';
import { UserService } from '../../services/user.service'; // Assuming you have a UserService to get the current user

@Component({
    selector: 'app-devices',
    templateUrl: './devices.component.html',
    styleUrls: ['./devices.component.css'],
})
export class DevicesComponent implements OnInit {
    devices: Device[] = [];
    newDevice: Device = { deviceId: 0, name: '', startTime: '', endTime: '', status: false, isActive:false, ownerId: 0 }; // Ensure ownerId is included

    constructor(private deviceService: DeviceService, private userService: UserService) {}

    ngOnInit(): void {
        this.loadDevices();
        this.initializeOwnerId(); // Initialize the ownerId for the newDevice
    }

    // Load all devices from the server
    loadDevices() {
        this.deviceService.getDevices().subscribe((devices) => {
            this.devices = devices;
        }, error => {
            console.error('Error loading devices:', error);
        });
    }

    // Create a new device
    createDevice() {
        if (this.newDevice.name) {
            const formattedStartTime = this.formatTime(this.newDevice.startTime);
            const formattedEndTime = this.formatTime(this.newDevice.endTime);

            this.deviceService.createDevice({
                ...this.newDevice,
                startTime: formattedStartTime,
                endTime: formattedEndTime,
                ownerId: this.newDevice.ownerId // Ensure the ownerId is sent
            }).subscribe((device) => {
                this.devices.push(device); // Add newly created device to list
                this.resetNewDevice(); // Reset form after successful creation
                console.log('Device created:', device);
            }, error => {
                console.error('Error creating device:', error);
            });
        } else {
            console.error('Device name is required');
        }
    }

    // Update an existing device
    updateDevice(device: Device) {
        const formattedStartTime = this.formatTime(device.startTime);
        const formattedEndTime = this.formatTime(device.endTime);

        this.deviceService.updateDevice({
            ...device,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            ownerId: device.ownerId // Ensure ownerId remains unchanged during update
        }).subscribe(() => {
            // Update the local devices array with the updated device
            const index = this.devices.findIndex(d => d.deviceId === device.deviceId);
            if (index > -1) {
                this.devices[index] = { ...device, status: !device.status }; // Toggle status or retain original based on your business logic
            }
            console.log('Device updated:', device);
        }, error => {
            console.error('Error updating device:', error);
        });
    }

    // Delete a device
    deleteDevice(deviceId: number) {
        this.deviceService.deleteDevice(deviceId).subscribe(() => {
            this.devices = this.devices.filter(d => d.deviceId !== deviceId); // Remove the deleted device from the list
            console.log('Device deleted:', deviceId);
        }, error => {
            console.error('Error deleting device:', error);
        });
    }

    // Trigger device creation through UI
    addDevice() {
        this.createDevice();
    }

    // Reset the new device form fields after creation
    resetNewDevice() {
        this.newDevice = { deviceId: 0, name: '', startTime: '', endTime: '', status: false, isActive: false, ownerId: this.newDevice.ownerId }; // Reset new device form, but keep ownerId
    }

    // Format time to "HH:mm:ss" for backend compatibility
    private formatTime(time: string): string {
        return `${time}:00`; // Append ":00" for seconds
    }

    // Initialize the ownerId using the current logged-in user
    private initializeOwnerId() {
        const currentUser = this.userService.getCurrentUser(); // Assuming the userService provides the current user info
        this.newDevice.ownerId = currentUser?.id ?? 0; // Set the ownerId from current user, default to 0 if undefined
    }
}
