import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User, UserTable } from '../../interfaces/User';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit, OnDestroy {
  private allUsersTable: UserTable[] = [];
  public usersTable: UserTable[] = [];

  private usersSubscription: Subscription = new Subscription();
  public selectedFilter = 0;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.usersSubscription = this.userService.$users.subscribe(
      (users: User[]) => {
        this.getUserTable(users);
      }
    );
  }

  getUserTable(users: User[]) {
    this.allUsersTable = [];
    for (const user of users) {
      const newUserTable: UserTable = {
        name: user.name.first,
        lastName: user.name.last,
        date: this.getBornDate(user.dob.date),
        age: user.dob.age,
      };

      this.allUsersTable.push(newUserTable);
    }
    this.filterUserTable();
  }

  getBornDate(isoDate: string): string {
    const date = new Date(isoDate);

    const day: string = date.getDate().toString().padStart(2, '0');
    const month: string = (date.getMonth() + 1).toString().padStart(2, '0');
    const year: string = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  selectFilter(filter: number) {
    this.selectedFilter = filter;
    this.filterUserTable();
  }

  filterUserTable() {
    switch (this.selectedFilter) {
      case 0:
        this.usersTable = this.allUsersTable;
        break;
      case 1:
        this.usersTable = this.allUsersTable.filter((user) => user.age < 21);
        break;
      case 2:
        this.usersTable = this.allUsersTable.filter(
          (user) => user.age >= 21 && user.age <= 55
        );
        break;
      case 3:
        this.usersTable = this.allUsersTable.filter((user) => user.age > 55);
        break;
    }
  }

  ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
  }
}
