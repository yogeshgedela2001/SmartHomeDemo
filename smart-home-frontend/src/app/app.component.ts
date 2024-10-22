import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service'; // Adjust the path as necessary
import { User } from './models/user.model'; // Import the User model
import { Router } from '@angular/router'; // Import Router for navigation

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // Fix styleUrl to styleUrls
})
export class AppComponent implements OnInit {
  title = 'smart-home-frontend';
  isUserAuthenticated: boolean = false; // Track user authentication status

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    // Subscribe to the currentUser observable to check authentication status
    this.userService.currentUser$.subscribe((user: User | null) => {
      this.isUserAuthenticated = !!user; // Set to true if user is logged in, false otherwise
    });
  }

  logout() {
    this.userService.clearCurrentUser(); // Clear user data on logout
    this.router.navigate(['/login']); // Redirect to login page after logout
  }
}
