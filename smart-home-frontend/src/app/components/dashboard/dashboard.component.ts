import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceService } from '../../services/device.service';
import { UserService } from '../../services/user.service';
import { Device } from '../../models/device.model';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { AddDeviceModalComponent } from '../../add-device-modal/add-device-modal.component';
import { EditDeviceModalComponent } from '../../edit-device-modal/edit-device-modal.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy { // Implement OnDestroy for cleanup
    devices: Device[] = [];
    user: User | null = null;
    newDevice: Device = { deviceId: 0, name: '', startTime: '', endTime: '', status: false, isActive: false, ownerId: 0 };
    editingDeviceId: number | null = null;
    notificationsVisible: boolean = false;
    notifications: string[] = [];
    currentDateTime: string = '';
    intervalId: any; 

    constructor(
        private deviceService: DeviceService,
        private userService: UserService,
        private router: Router,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.checkAuthentication();
        this.loadDevices();
        this.subscribeToCurrentUser();
        this.setCurrentDateTime();
        this.startPolling(); 
    }

    ngOnDestroy(): void {
        this.stopPolling(); 
    }

    private subscribeToCurrentUser(): void {
        this.userService.currentUser$.subscribe((user) => {
            this.user = user;
            this.setOwnerId();
        });
    }

    private checkAuthentication(): void {
        if (!this.userService.isAuthenticated()) {
            this.router.navigate(['/login']);
        }
    }

    loadDevices(): void {
        this.deviceService.getDevices().subscribe(
            (devices) => {
                this.devices = this.user?.isAdmin ? devices : devices.filter(device => device.ownerId === this.user?.id);
            },
            (error) => {
                console.error('Error loading devices:', error);
            }
        );
    }

    setCurrentDateTime(): void {
        const now = new Date();
        this.currentDateTime = now.toLocaleString();
    }

    private setOwnerId(): void {
        this.newDevice.ownerId = this.user ? this.user.id : 0;
    }

    updateDevice(device: Device): void {
        const formattedDevice = {
            ...device,
            startTime: this.formatTime(device.startTime),
            endTime: this.formatTime(device.endTime),
        };

        this.deviceService.updateDevice(formattedDevice).subscribe(
            () => {
                console.log('Device updated:', formattedDevice);
                this.addNotification(`Device "${formattedDevice.name}" updated successfully.`);
            },
            (error) => {
                console.error('Error updating device:', error);
                this.addNotification(`Error updating device "${formattedDevice.name}": ${error.message}`);
            }
        );
    }

    deleteDevice(deviceId: number): void {
        this.deviceService.deleteDevice(deviceId).subscribe(
            () => {
                console.log('Device deleted:', deviceId);
                this.loadDevices();
                this.addNotification(`Device deleted successfully.`);
            },
            (error) => {
                console.error('Error deleting device:', error);
                this.addNotification(`Error deleting device: ${error.message}`);
            }
        );
    }

    addDevice(): void {
        const formattedStartTime = this.formatTime(this.newDevice.startTime);
        const formattedEndTime = this.formatTime(this.newDevice.endTime);

        if (this.newDevice.name && formattedStartTime && formattedEndTime) {
            this.deviceService.createDevice({
                ...this.newDevice,
                startTime: formattedStartTime,
                endTime: formattedEndTime,
            }).subscribe(
                (device) => {
                    console.log('Device added:', device);
                    this.devices.push(device);
                    this.resetNewDevice();
                    this.addNotification(`Device "${device.name}" added successfully.`);
                },
                (error) => {
                    console.error('Error adding device:', error.error.errors);
                    this.addNotification(`Error adding device: ${error.error.errors}`);
                }
            );
        } else {
            console.error('Device name, start time, and end time are required');
            this.addNotification('Device name, start time, and end time are required');
        }
    }

    openAddDeviceModal(): void {
        this.resetNewDevice();

        const dialogRef = this.dialog.open(AddDeviceModalComponent, {
            width: '400px',
            data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.newDevice = result;
                this.addDevice();
            }
        });
    }

    openEditDeviceModal(device: Device): void {
        const dialogRef = this.dialog.open(EditDeviceModalComponent, {
            width: '400px',
            data: { device }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.editingDeviceId = result.deviceId;
                this.newDevice = result;
                this.saveEdit();
            }
        });
    }

    saveEdit(): void {
        const formattedStartTime = this.formatTime(this.newDevice.startTime);
        const formattedEndTime = this.formatTime(this.newDevice.endTime);

        if (this.editingDeviceId !== null && this.newDevice.name && formattedStartTime && formattedEndTime) {
            this.deviceService.updateDevice({
                ...this.newDevice,
                startTime: formattedStartTime,
                endTime: formattedEndTime,
            }).subscribe(
                () => {
                    console.log('Device updated:', this.newDevice);
                    const index = this.devices.findIndex(device => device.deviceId === this.editingDeviceId);
                    if (index !== -1) {
                        this.devices[index] = { ...this.newDevice }; // Update the edited device in the local array
                    }
                    this.editingDeviceId = null; // Reset editing ID
                    this.addNotification(`Device "${this.newDevice.name}" updated successfully.`);
                    this.resetNewDevice(); // Reset the form after saving
                },
                (error) => {
                    console.error('Error updating device:', error.error.errors);
                    this.addNotification(`Error updating device: ${error.error.errors}`);
                }
            );
        } else {
            console.error('All fields are required for editing the device');
            this.addNotification('All fields are required for editing the device');
        }
    }

    resetNewDevice(): void {
        this.newDevice = { 
            deviceId: 0, 
            name: '', 
            startTime: '', 
            endTime: '', 
            status: false, 
            isActive: false,
            ownerId: this.user ? this.user.id : 0 
        };
        this.editingDeviceId = null; 
    }

    toggleDeviceStatus(device: Device): void {
        device.status = !device.status; 
        this.updateDevice(device); 
    }

    formatTime(time: string): string {
        const [hours, minutes] = time.split(':').map(Number);
        if (isNaN(hours) || isNaN(minutes)) {
            console.error('Invalid time format:', time);
            return '00:00:00'; 
        }
        const formattedHours = String(hours % 24).padStart(2, '0');
        const formattedMinutes = String(minutes % 60).padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}:00`; 
    }

    openNotifications(): void {
        this.notificationsVisible = !this.notificationsVisible; 
    }

    closeNotifications(): void {
        this.notificationsVisible = false; 
    }

    addNotification(message: string): void {
        this.notifications.push(message); 
    }

    deleteNotification(index: number): void {
        if (index > -1) {
            this.notifications.splice(index, 1); 
        }
    }

    updateAllDevices(): void {
        this.deviceService.updateAllDevices().subscribe(
            () => {

                this.loadDevices(); // Optionally reload devices to reflect changes
            },
            (error) => {
                console.error('Error updating all devices:', error);
                this.addNotification('Error updating all devices: ' + error.message);
            }
        );
    }
    
    startPolling(): void {
        this.intervalId = setInterval(() => {
            this.updateAllDevices(); 
        }, 10000); 
    }

    // Stop polling
    stopPolling(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null; // Clear the ID after stopping
        }
    }
}
