import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    // Initialize properties with default values
    name: string = '';
    email: string = '';
    password: string = '';
    isAdmin: boolean = false; // Default to false

    constructor(private userService: UserService, private router: Router) {}

    onSubmit() {
        // Create a user object with the input values
        const user = {
            name: this.name,
            email: this.email,
            password: this.password,
            isAdmin: this.isAdmin,
        };

        // Call the register method from UserService
        this.userService.register(user).subscribe(
            (newUser) => {
                // Handle successful registration
                console.log('Registration successful:', newUser);
                this.router.navigate(['/login']);
            },
            (error) => {
                // Handle registration failure
                console.error('Registration failed:', error);
                // You might want to show an error message to the user here
            }
        );
    }
}
