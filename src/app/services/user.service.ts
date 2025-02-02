import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { BroadcastCookieService } from './broadcast-cookies.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient, // Build private HTTP client
    private router: Router, // Build private router
    private cookieService: CookieService, // Create cookie service
    private BroadcastCookieService: BroadcastCookieService, // Import Broadcast Cookie Service
    private browserCookieService: CookieService, // Cookie service
  ) { }

  // Register user
  public register(postRequest: any): Observable<any> {
    return this.http.post<any>('http://localhost:4000/api/users/register', postRequest);
  }

  // Login user
  public login(postRequest: any): Observable<any> {
    return this.http.post<any>('http://localhost:4000/api/users/authenticate', postRequest);
  }
  // Log out user
  public logout() {
    this.BroadcastCookieService.logout();
  }

  // Fetch username
  public getUser(): string {
    return this.cookieService.get('username');
  };

  public getUserProfile(): Observable<any> {
    let headers = new HttpHeaders({ Authorization: 'Bearer ' + this.browserCookieService.get('token') });
    return this.http.get<any>('http://localhost:4000/api/messages/mymessages',
      {
        headers: headers
      }
    );
  }

  public getUsers(): Observable<any> {
    let headers = new HttpHeaders({ Authorization: 'Bearer ' + this.browserCookieService.get('token') });
    return this.http.get<any>('http://localhost:4000/api/users',
      {
        headers: headers
      }
    );
  }

  public getCurrentUser(): Observable<any> {
    let headers = new HttpHeaders({ Authorization: 'Bearer ' + this.browserCookieService.get('token') });
    return this.http.get<any>('http://localhost:4000/api/users/currentuser',
      {
        headers: headers
      }
    );
  }

  // Observable<any>
  // Log out user
  public signOut(): void {
    this.cookieService.set('token', 'logged_out'); // Set token to empty string
    this.cookieService.delete('username') // Delete username token
    this.router.navigate(['goodbye']);
  };

  // Get token status
  public tokenStatus(): any {
    if (this.cookieService.get('token') === "logged_out") { // Logged out
      return false;
    } else if (this.cookieService.get('token')) { // Logged in
      return true;
    } else {
      return null; // No token? 👀
    }
  };

  public setToken(token: string) {
    this.cookieService.set('token', token);
  }

  public setUsername(username: string) {
    this.cookieService.set('username', username);
  }

  public followUser(userID: number): Observable<any> {
    console.log(userID)
    let headers = new HttpHeaders({ Authorization: 'Bearer ' + this.browserCookieService.get('token') });
    return this.http.post<any>(`http://localhost:4000/api/messages/followingusers/${userID}`,
      {},
      {
        headers: headers
      }
    )
  }

  public unfollowUser(userID: number): Observable<any> {
    console.log(userID)
    let headers = new HttpHeaders({ Authorization: 'Bearer ' + this.browserCookieService.get('token') });
    return this.http.delete<any>(`http://localhost:4000/api/messages/followingusers/${userID}`,
      {
        headers: headers
      }
    )
  }

  public getFollowingUsers(): Observable<any> {
    let headers = new HttpHeaders({ Authorization: 'Bearer ' + this.browserCookieService.get('token') });
    return this.http.get<any>(`http://localhost:4000/api/messages/followingusers/`,
      {
        headers: headers
      }
    )
  }

  getSpecificUser(userId: number): Observable<any> {
    let headers = new HttpHeaders({ Authorization: 'Bearer ' + this.browserCookieService.get('token') });
    return this.http.get<any>(`http://localhost:4000/api/users/${userId}`,
      {
        headers: headers
      }
    )
  }

  getSpecificUsersPosts(userId: number): Observable<any> {
    let headers = new HttpHeaders({ Authorization: 'Bearer ' + this.browserCookieService.get('token') });
    return this.http.get<any>(`http://localhost:4000/api/messages/usermessages/${userId}`,
      {
        headers: headers
      }
    )
  }
}
