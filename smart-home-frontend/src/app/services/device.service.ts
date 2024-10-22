import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Device } from '../models/device.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DeviceService {
    // API URL for device-related operations
    private apiUrl = 'http://localhost:5035/api/Device';

    constructor(private http: HttpClient) {}

    // Fetch all devices from the server
    getDevices(): Observable<Device[]> {
        return this.http.get<Device[]>(this.apiUrl);
    }

    // Create a new device on the server
    createDevice(device: Device): Observable<Device> {
        return this.http.post<Device>(this.apiUrl, device);
    }

    // Update an existing device on the server
    updateDevice(device: Device): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${device.deviceId}`, device);
    }

    // Delete a device by its ID
    deleteDevice(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);

    }

updateAllDevices(): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/update-all`, {});
}

}

