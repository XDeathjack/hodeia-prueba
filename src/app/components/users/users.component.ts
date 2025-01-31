import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/User';
import { skip, Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit, OnDestroy {
  public users: User[] = [];
  private usersSubscription: Subscription = new Subscription();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.usersSubscription = this.userService.$users.subscribe(
      (users: User[]) => {
        console.log('CAMBIO');
        this.users = users;
        console.log(this.users);
      }
    );
  }

  ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
  }
}
