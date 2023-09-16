import { Component, ViewChild, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        min: 1,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      datalabels: {
        formatter: (value, ctx) => {
          const dataset = ctx.chart.data.datasets[ctx.datasetIndex];
          const total: any = dataset.data.reduce(
            (acc: any, data: any) => acc + data,
            0
          );
          const percentage = ((value / total) * 100).toFixed(2) + '%';
          return percentage;
        },
        color: '#fff',
      },
    },
  };
  public barChartType: ChartType = 'bar';
  public pieChartType: ChartType = 'pie';

  public barChartPlugins = [DataLabelsPlugin];
  public pieChartPlugins = [DataLabelsPlugin];

  public barChartData: ChartData<'bar'> = {
    labels: [], // Initialize with empty labels
    datasets: [
      { data: [], label: 'Price of Products' }, // Initialize with empty data
    ],
  };
  public pieChartData: ChartData<'pie'> = {
    labels: [], // Initialize with empty labels
    datasets: [
      {
        data: [], // Initialize with empty data
        backgroundColor: [], // Colors for each segment
        hoverBackgroundColor: [], // Colors for hover state
      },
    ],
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Fetch data from your API endpoint
    this.http.get('https://dummyjson.com/products').subscribe((data: any) => {
      const products = data.products;

      // Sort products by price in descending order (higher price first)
      products.sort((a: any, b: any) => b.price - a.price);
         products.sort((a: any, b: any) => b.stock - a.stock);

         // Select the top 5 products with the highest stock
         const top5Products = products.slice(0, 5);

      const productTitles = products.map((product: any) => product.title);
      const productPrices = products.map((product: any) => product.price);
    const product5Titles = top5Products.map((product: any) => product.title);
    const productStock = top5Products.map((product: any) => product.stock);

      // Update the chart data and labels
      this.barChartData.labels = productTitles;
      this.barChartData.datasets[0].data = productPrices;
        this.pieChartData.labels = productTitles;
        this.pieChartData.datasets[0].data = productStock;
        this.pieChartData.datasets[0].backgroundColor =
          this.generateRandomColors(productStock.length);
        this.pieChartData.datasets[0].hoverBackgroundColor =
          this.generateRandomColors(productStock.length);

      // Update the chart
      this.chart?.update();
    });
  }
 private generateRandomColors(numColors: number): string[] {
    // Generate random colors for the pie chart segments
    const colors: string[] = [];
    for (let i = 0; i < numColors; i++) {
      colors.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
    }
    return colors;
  }
 // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }
}
