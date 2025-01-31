import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { User } from '../interfaces/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl: string = 'https://randomuser.me/api/?results=10';

  private usersSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(
    []
  );

  public $users: Observable<User[]> = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUsers() {
    this.http
      .get<any>(this.apiUrl)
      .pipe(map((response) => response.results))
      .subscribe((users: User[]) => {
        this.usersSubject.next(users);
      });
  }
}
