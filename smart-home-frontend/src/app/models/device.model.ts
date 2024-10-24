export interface Device {
    deviceId: number;
    name: string;
    startTime: string;
    endTime: string;
    status: boolean;
    isActive: boolean;
    ownerId?: number; // Make ownerId optional
}
