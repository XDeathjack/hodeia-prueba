import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/User';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent implements OnInit, OnDestroy {
  private usersSubscription: Subscription = new Subscription();

  public lessAge: number = 0;
  public middleAge: number = 0;
  public greaterAge: number = 0;

  @ViewChild('MyChart', { static: true })
  chartRef!: ElementRef<HTMLCanvasElement>;
  public chart!: Chart;

  constructor(private userService: UserService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.usersSubscription = this.userService.$users.subscribe(
      (users: User[]) => {
        this.getAgeRanges(users);
      }
    );
  }

  getAgeRanges(users: User[]) {
    this.resetAgeRanges();
    for (const user of users) {
      if (user.dob.age < 21) {
        this.lessAge++;
      } else if (user.dob.age > 55) {
        this.greaterAge++;
      } else {
        this.middleAge++;
      }
    }

    this.createChart();
  }

  resetAgeRanges() {
    this.lessAge = 0;
    this.greaterAge = 0;
    this.middleAge = 0;
  }

  createChart() {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: ['<21', '21-55', '55>'],
        datasets: [
          {
            data: [this.lessAge, this.middleAge, this.greaterAge],
            backgroundColor: ['#eb0000', '#ffc000', '#55ee14'],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: 135,
        plugins: {
          legend: {
            labels: {
              boxHeight: 15,
              boxWidth: 40,
              font: {
                size: 14,
              },
              color: '#333333',
            },
          },
        },
      },
    };

    this.chart = new Chart(ctx, config);
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    this.usersSubscription.unsubscribe();
  }
}
