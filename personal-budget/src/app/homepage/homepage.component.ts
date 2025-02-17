// import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
// import { ArticleComponent } from '../article/article.component';
// import { isPlatformBrowser } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
// import { Chart} from 'chart.js/auto';
// import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
// import * as d3 from 'd3';

// @Component({
//   selector: 'pb-homepage',
//   imports: [ArticleComponent, BreadcrumbsComponent],
//   templateUrl: './homepage.component.html',
//   styleUrl: './homepage.component.scss'
// })
// export class HomepageComponent implements AfterViewInit {

//   public dataSource = {
//     datasets: [
//         {
//             data: [],
//             backgroundColor: [
//             '#ffcd56',
//             '#ff6384',
//             '#36a2eb',
//             '#fd6b19',
//             '#4bc0c0',
//             '#9966ff',
//             '#ff9f40'
//             ]
//         }
//     ],
//     labels: []
// };
//   constructor(private http: HttpClient,
//     @Inject(PLATFORM_ID) private platformId: Object
//   ) {}
//   ngAfterViewInit(): void {
//     this.http.get('http://localhost:3000/budget')
//     .subscribe((res : any) => {

//       const budgetData = res.myBudget;
//         this.dataSource.labels = budgetData.map((item:any) => item.title);
//         this.dataSource.datasets[0].data = budgetData.map((item:any) => item.budget);
//         this.createChart();

//         this.createD3Chart(budgetData);

//     });
//   }

//   createChart() {
//     if (isPlatformBrowser(this.platformId)) {
//       const canvas = document.getElementById('myChart') as HTMLCanvasElement;

//       const ctx = canvas.getContext('2d');
//       if (!ctx) {
//         console.error("Failed to get context");
//         return;
//       }

//       const myPieChart = new Chart(ctx, {
//         type: 'pie',
//         data: this.dataSource
//       });

//     }
//   }

// }
import { AfterViewInit, Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import * as d3 from 'd3';
import { ArticleComponent } from '../article/article.component';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { DataService } from '../data.service';

@Component({
  selector: 'pb-homepage',
  imports: [ArticleComponent, BreadcrumbsComponent],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit {

  public dataSource = {
    datasets: [
      {
        data: [] as number[],
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
    labels: [] as string[]
  };

  constructor(private dataService: DataService, private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    // Use DataService to fetch data
    this.dataService.fetchBudgetData().subscribe((res: any) => {
      console.log('Backend Response:', res); // Verify the response

      const budgetData = res.myBudget; // Access the `myBudget` array
      console.log('Budget Data:', budgetData); // Check the data

      if (Array.isArray(budgetData)) {
        // Update the dataSource for Chart.js
        this.dataSource.labels = budgetData.map((item: any) => item.title);
        this.dataSource.datasets[0].data = budgetData.map((item: any) => item.budget);

        // Create the Chart.js chart
        this.createChart();

        // Create the D3.js chart
        this.createD3Chart(budgetData);
      } else {
        console.error('Received budgetData is not an array');
      }
    });
  }

  // Create the Chart.js Pie Chart
  createChart() {
    if (isPlatformBrowser(this.platformId)) {
      const canvas = document.getElementById('myChart') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Failed to get context');
        return;
      }

      new Chart(ctx, {
        type: 'pie',
        data: this.dataSource
      });
    }
  }

  // Create the D3.js Pie Chart


  createD3Chart(data: any) {
    if (isPlatformBrowser(this.platformId)) {
      const width = 400, height = 400, radius = Math.min(width, height) / 2;

      // Clear any existing SVG content
      d3.select("#d3-chart").select("svg").remove();

      // Create the SVG container
      const svg = d3.select('#d3-chart')
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .append('g')
                    .attr('transform', `translate(${width / 2}, ${height / 2})`);

      // Set up the color scale based on the title
      const color = d3.scaleOrdinal<string>()
                      .domain(data.map((d: any) => d.title)) // Ensure titles are used as domain
                      .range([
                        '#ffcd56', '#ff6384', '#36a2eb', '#fd6b19',
                        '#4bc0c0', '#e74c3c', '#9b59b6', '#2ecc71'
                      ]);

      // Define the pie chart layout
      const pie = d3.pie<{ budget: number; title: string }>().value(d => d.budget);

      // Define the arc generator
      const arc = d3.arc<d3.PieArcDatum<{ budget: number; title: string }>>()
                    .innerRadius(0) // Full pie chart
                    .outerRadius(radius); // Outer radius

      // Create arc paths (pie slices)
      svg.selectAll('path')
        .data(pie(data)) // Pass data for the pie chart
        .enter()
        .append('path')
        .attr('d', arc as any) // Generate the arc for each pie slice
        .attr('fill', (d: d3.PieArcDatum<any>) => color(d.data.title)) // Use title to assign the color

      // Add labels to the pie slices
      svg.selectAll("text")
        .data(pie(data))
        .enter()
        .append("text")
        .text((d: any) => d.data.title) // Set the label text as the title
        .attr("transform", (d: any) => `translate(${arc.centroid(d)})`) // Position label at the centroid of the arc
        .style("text-anchor", "middle") // Center the label
        .style("font-size", "12px") // Set font size
        .style("fill", "white"); // Set label color to white
    }
  }



}
