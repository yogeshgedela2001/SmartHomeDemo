import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators'; // Import tap operator
import { User } from '../../models/user.model'; // Import User model

@Component({
    selector: 'app-login',
    styleUrls: ['./login.component.css'],
    templateUrl: './login.component.html',
})
export class LoginComponent {
    // Initialize the properties with default values
    email: string = '';
    password: string = '';
    errorMessage: string | null = null; // To store any error messages

    constructor(private userService: UserService, private router: Router) {}

    onSubmit() {
        // Call the login method from UserService
        this.userService.login(this.email, this.password).pipe(
            tap((user: User) => {
                // Handle successful login
                console.log('Login successful:', user);
                this.userService.setCurrentUser(user); // Set the current user in the service
                this.router.navigate(['/dashboard']);
            })
        ).subscribe(
            null, // Successful login logic handled in tap
            (error) => {
                // Handle login failure
                console.error('Login failed:', error);
                this.errorMessage = 'Login failed. Please check your credentials and try again.'; // Set error message
            }
        );
    }
}
