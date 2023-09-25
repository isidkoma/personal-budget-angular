import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'pb-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.scss']
})
export class PieChartComponent implements AfterViewInit {
  @ViewChild('piechart', { static: true }) private chartContainer!: ElementRef;

  ngAfterViewInit(): void {
    // Access the chart container element
    const container = this.chartContainer!.nativeElement;

    // Sample data for the pie chart
    const data = [25, 75, 55, 55, 45, 40, 85, 40];
    const labels = [
      'Eat Out',
      'Rent',
      'Grocery',
      'Education',
      'HealthCare',
      'Vacation',
      'Savings',
      'Electronics',
    ];

    // Create a color scale and assign colors
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    const colors = data.map((_, i) => colorScale(i.toString()));

    // Create a pie layout
    const pie = d3.pie<number>()(data);

    // Create the SVG element
    const svg = d3.select(container).append('svg')
      .attr('width', 600)
      .attr('height', 600);

    // Create a group element for the pie chart
    const pieGroup = svg.append('g')
      .attr('transform', 'translate(150, 150)'); // Center the pie chart

    // Create arcs for the pie segments
    const arcs = d3.arc<any, d3.DefaultArcObject>() // Specify the types here
      .innerRadius(0)
      .outerRadius(100);

    // Add the pie slices to the chart
    const slices = pieGroup.selectAll('path')
      .data(pie)
      .enter()
      .append('path')
      .attr('d', arcs as any) // Explicitly cast arcs to any
      .attr('fill', (d: any, i: number) => colors[i])
      .on('click', (event) => {
        const selectedLabel = labels[event.index];
        alert(`You clicked on ${selectedLabel}`);
      });

    // Attach mouseover and mouseout event listeners to the SVG container
    svg.on('mouseover', function () {
      const [x, y] = d3.pointer(this); // Get mouse coordinates relative to SVG
      const index = slices.nodes().findIndex((node) => d3.select(node).attr('fill'));
      const selectedLabel = labels[index];
      showLabel(selectedLabel, x, y);
    });

    svg.on('mouseout', () => {
      // Hide the label when the mouse moves out
      hideLabel();
    });

    // Function to show the label
    function showLabel(label: string, x: number, y: number) {
      // Implement your logic to display the label as needed
      // For example, you can create a tooltip element and show it
      const tooltip = d3.select(container).append('div')
        .attr('class', 'tooltip')
        .style('left', x + 'px')
        .style('top', y + 'px')
        .html(label);

      tooltip.transition()
        .duration(200)
        .style('opacity', 0.9);
    }

    // Function to hide the label
    function hideLabel() {
      // Implement your logic to hide the label as needed
      // For example, you can remove the tooltip element
      d3.select('.tooltip').remove();
    }

    // Display labels and colors at the top of the pie chart
    const legendGroup = svg.append('g')
      .attr('transform', 'translate(300, 10)'); // Adjust the position as needed

    const legendItems = legendGroup.selectAll('.legend-item')
      .data(labels)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`);

    legendItems.append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', (d: any, i: number) => colors[i]);

    legendItems.append('text')
      .attr('x', 20)
      .attr('y', 10)
      .text((d: any) => d);
  }
}
