import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-tree-chart',
  templateUrl: './tree-chart.component.html',
  standalone: true,
  styleUrls: ['./tree-chart.component.scss']
})
export class TreeChartComponent implements OnChanges {
  @Input() data: any;
  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.createChart();
    }
  }

  createChart(): void {
    const element = this.chartContainer.nativeElement;
    element.innerHTML = '';

    const width = 800;
    const dx = 80;
    const dy = width / 6;
    const margin = { top: 10, right: 120, bottom: 10, left: 120 };

    const root = d3.hierarchy(this.data);
    const treeLayout = d3.tree().nodeSize([dx, dy]);
    treeLayout(root);

    let x0 = Infinity;
    let x1 = -x0;
   root.each(d => {
  if (d.x! < x0) x0 = d.x!;
  if (d.x! > x1) x1 = d.x!;
});

    const svg = d3.select(element).append('svg')
      .attr('viewBox', [
        -margin.left,
        x0 - margin.top,
        width,
        x1 - x0 + margin.top + margin.bottom
      ])
      .style('font', '12px sans-serif');

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${-x0 + margin.top})`);

    const link = d3.linkHorizontal()
      .x((d: any) => d.y)
      .y((d: any) => d.x);

    g.append('g')
      .selectAll('path')
      .data(root.links())
      .join('path')
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)
      .attr('d', d => link(d as any));

    g.append('g')
      .selectAll('circle')
      .data(root.descendants())
      .join('circle')
      .attr('transform', d => `translate(${d.y},${d.x})`)
      .attr('fill', d => d.children ? '#555' : '#999')
      .attr('r', 5);

    g.append('g')
      .selectAll('text')
      .data(root.descendants())
      .join('text')
      .attr('transform', d => `translate(${d.y},${d.x})`)
      .attr('dy', '0.31em')
      .attr('x', d => d.children ? -10 : 10)
      .attr('text-anchor', d => d.children ? 'end' : 'start')
      .text(d => d.data.name)
      .clone(true).lower()
      .attr('stroke', 'white');
  }
}
