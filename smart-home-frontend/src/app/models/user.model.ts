export interface User {
    id?: number; // Make id optional
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
}
