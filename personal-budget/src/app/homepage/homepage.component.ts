import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, ChartOptions, ChartDataset } from 'chart.js/auto';
import { DataService } from '../data.service'; 
import * as d3 from 'd3';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, AfterViewInit, OnDestroy {
  public dataSource: {
    datasets: ChartDataset[];
    labels: string[];
  } = {
    datasets: [
      {
        data: [],
        backgroundColor: [
          "#ff5733",
          "#ffa733",
          "#33ff57",
          "#336aff",
          "#a733ff",
          "#ff33c9",
          "#33ffc9",
        ],
      },
    ],
    labels: [],
  };

  myPieChart: Chart | undefined;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.fetchDataFromBackend().subscribe((res:any) => {
      for (let i = 0; i < res.myBudget.length; i++) {
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
        this.dataSource.labels[i] = res.myBudget[i].title;
      }
      this.createChart(); // Call createChart when data is available
    });
  }

  ngAfterViewInit(): void {
    // Leave this empty for now
  }

  ngOnDestroy(): void {
    if (this.myPieChart) {
      this.myPieChart.destroy();
    }
  }

  createChart() {
    setTimeout(() => {
      const ctx = document.getElementById("myChart") as HTMLCanvasElement;
      console.log(ctx);
      if (!ctx) {
        console.error('Canvas element not found.');
        return;
      }

      if (this.myPieChart) {
        this.myPieChart.destroy();
      }

      try {
        this.myPieChart = new Chart(ctx, {
          type: 'pie',
          data: this.dataSource,
          options: {
            responsive: false,
            maintainAspectRatio: false,
          } as ChartOptions
        });
      } catch (error) {
        console.error('Error creating chart:', error);
      }
    });
  }
}
