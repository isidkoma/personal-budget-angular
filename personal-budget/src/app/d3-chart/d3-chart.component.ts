import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { DataService } from '../data.service'; 

@Component({
  selector: 'pb-d3-chart',
  templateUrl: './d3-chart.component.html',
  styleUrls: ['./d3-chart.component.scss']
})
export class D3ChartComponent implements OnInit {
  @ViewChild('donutChart', { static: true }) private chartContainer!: ElementRef;

  constructor() { }

  ngOnInit(): void {
    // Sample data for the donut chart
    const data: number[] = [25,75,55,55,45,40,85,40]; // Updated data

    // Create the SVG element
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Create a color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Create the donut chart layout
    const pie = d3.pie()
      .value((d: any) => d); // Use 'd' directly

    const data_ready = pie(data);

    // Build the donut chart
    svg.selectAll('path')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', (d: any) => d3.arc()
        .innerRadius(100)
        .outerRadius(radius)(d) as string
      )
      .attr('fill', (d: any, i: number) => color(i.toString())) // Use index as a string for color scale
      .attr('stroke', 'white')
      .style('stroke-width', '2px');

    // Add labels
    
  }
}
