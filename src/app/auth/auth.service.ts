import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map, catchError, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3001/users';
    // Signals for state management
    currentUser = signal<any>(null);
    isLoggedIn = signal<boolean>(false);

    constructor(private http: HttpClient, private router: Router) {
        // Check local storage on init
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            this.currentUser.set(JSON.parse(storedUser));
            this.isLoggedIn.set(true);
        }
    }

    register(userData: any): Observable<any> {
        // Trim string inputs
        const cleanData = { ...userData };
        if (cleanData.username) cleanData.username = cleanData.username.trim();
        if (cleanData.email) cleanData.email = cleanData.email.trim();
        if (cleanData.password) cleanData.password = cleanData.password.trim();

        // Check if user exists first (simple simulation)
        return this.http.get<any[]>(`${this.apiUrl}?username=${cleanData.username}`).pipe(
            map(users => {
                if (users.length > 0) {
                    throw new Error('Username already taken');
                }
                return cleanData;
            }),
            tap(() => {
                // Proceed to register
                this.createUser(cleanData).subscribe();
            })
        );
    }

    private createUser(userData: any): Observable<any> {
        return this.http.post(this.apiUrl, userData);
    }

    login(credentials: any): Observable<boolean> {
        const username = credentials.username.trim();
        const password = credentials.password.trim();

        return this.http.get<any[]>(`${this.apiUrl}?username=${username}&password=${password}`)
            .pipe(
                map(users => {
                    if (users.length > 0) {
                        const user = users[0];
                        this.setSession(user);
                        return true;
                    }
                    return false;
                }),
                catchError(() => of(false))
            );
    }

    logout() {
        this.currentUser.set(null);
        this.isLoggedIn.set(false);
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
    }

    private setSession(user: any) {
        this.currentUser.set(user);
        this.isLoggedIn.set(true);
        localStorage.setItem('user', JSON.stringify(user));
    }
}
