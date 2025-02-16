import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ArticleComponent } from '../article/article.component';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Chart} from 'chart.js/auto';
import { Console } from 'console';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'pb-homepage',
  imports: [ArticleComponent, BreadcrumbsComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements AfterViewInit {

  public dataSource = {
    datasets: [
        {
            data: [],
            backgroundColor: [
            '#ffcd56',
            '#ff6384',
            '#36a2eb',
            '#fd6b19',
            '#4bc0c0',
            '#9966ff',
            '#ff9f40'
            ]
        }
    ],
    labels: []
};
  constructor(private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  ngAfterViewInit(): void {
    this.http.get('http://localhost:3000/budget')
    .subscribe((res : any) => {

      const budgetData = res.myBudget;
        this.dataSource.labels = budgetData.map((item:any) => item.title);
        this.dataSource.datasets[0].data = budgetData.map((item:any) => item.budget);
        console.log(this.createChart());

        //this.createD3Chart(budgetData);

    });
  }

  createChart() {
    if (isPlatformBrowser(this.platformId)) {
      const canvas = document.getElementById('myChart') as HTMLCanvasElement;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error("Failed to get context");
        return;
      }

      const myPieChart = new Chart(ctx, {
        type: 'pie',
        data: this.dataSource
      });

    }
  }

}

