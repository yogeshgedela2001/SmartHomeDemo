import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private apiUrl = 'http://localhost:5035/api/User';
    private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable(); // Observable to be used in components

    constructor(private http: HttpClient) {
        this.loadUserFromStorage(); // Load user from local storage on service initialization
    }

    // Load user data from local storage
    private loadUserFromStorage() {
        // Check if localStorage is available
        if (typeof window !== 'undefined' && window.localStorage) {
            const userData = localStorage.getItem('currentUser');
            if (userData) {
                const user: User = JSON.parse(userData);
                this.setCurrentUser(user); // Set the user in the BehaviorSubject
            }
        }
    }

    register(user: User): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/register`, user);
    }

    login(email: string, password: string): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/login`, { email, password }).pipe(
            tap((user) => {
                this.setCurrentUser(user); // Set the current user upon successful login
                
                // Store user data in local storage if available
                if (typeof window !== 'undefined' && window.localStorage) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
            }),
            catchError((error) => {
                console.error('Login failed:', error);
                return throwError(error); // Rethrow the error for further handling
            })
        );
    }

    logout(): void {
        this.clearCurrentUser(); // Clear user data on logout
        
        // Remove user data from local storage if available
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem('currentUser');
        }
    }

    setCurrentUser(user: User) {
        this.currentUserSubject.next(user); // Update the current user
    }

    clearCurrentUser() {
        this.currentUserSubject.next(null); // Clear user data in BehaviorSubject
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value; // Get the current user value
    }

    isAuthenticated(): boolean {
        return this.currentUserSubject.value !== null; // Check if user is logged in
    }
}
