import { Component, OnInit } from '@angular/core';
import { UsersComponent } from '../../components/users/users.component';
import { ChartComponent } from '../../components/chart/chart.component';
import { ListComponent } from '../../components/list/list.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [UsersComponent, ChartComponent, ListComponent],
  providers: [UserService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers();
  }
}
