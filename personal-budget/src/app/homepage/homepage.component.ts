import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, ChartOptions, ChartDataset } from 'chart.js/auto';
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

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('http://localhost:3000/budget')
      .subscribe((res: any) => {
        for (let i = 0; i < res.myBudget.length; i++) {
          this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
          this.dataSource.labels[i] = res.myBudget[i].title;
        }
        this.createChart(); // Call createChart when data is available
      });
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





  createDonutChart(data: any[]) {
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select('#donutChartContainer')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.label))
      .range(["#ff5733", "#ffa733", "#33ff57", "#336aff", "#a733ff", "#ff33c9", "#33ffc9"]);

    const pie = d3.pie()
      .value(d => d.value);

    const path = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

    const label = d3.arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);

    const arcs = svg.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', path)
      .attr('fill', d => color(d.data.label));

    arcs.append('text')
      .attr('transform', d => `translate(${label.centroid(d)})`)
      .attr('dy', '0.35em')
      .text(d => d.data.label);
  }

  ngOnInit(): void {
    this.http.get('http://localhost:3000/budget')
      .subscribe((res: any) => {
        for (let i = 0; i < res.myBudget.length; i++) {
          this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
          this.dataSource.labels[i] = res.myBudget[i].title;
        }
        this.createChart(); // Call createChart when data is available
        this.createDonutChart(res.myBudget); // Call createDonutChart with the data
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


}

        