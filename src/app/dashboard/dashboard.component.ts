import { Component, signal, computed, OnInit } from '@angular/core';
import {
  ChartData,
  ChartOptions,
  ChartType,
  ChartConfiguration,
} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective, BarChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      if (token) {
        localStorage.setItem('token', token);
      } else {
        const token = localStorage.getItem('token');
        if (token) {
          this.router.navigate([`/dashboard/${token}`]);
        } else {
          window.location.href = 'http://localhost:3000/login';
        }
      }
    });
  }

  // section tow
  // إعدادات الرسم البياني
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      tooltip: {
        // تكوين النص الظاهر عند تمرير الماوس فوق الأعمدة
        callbacks: {
          label: function (context) {
            const datasetLabel = context.dataset.label || '';
            const data = context.raw;
            return `${datasetLabel}: ${data}`;
          },
        },
      },
    },
    scales: {
      x: {},
      y: { beginAtZero: true }, // بدء المحور y من الصفر
    },
  };

  // بيانات الرسم البياني
  public barChartData: ChartData<'bar'> = {
    labels: ['Level 1', 'Level 2', 'Level 3', 'Level 4'],
    datasets: [
      { label: 'Volume', data: [79, 80, 75, 90], backgroundColor: '#72d7d2' },
      { label: 'Service', data: [78, 81, 70, 95], backgroundColor: '#43425D' },
    ],
  };

  public barChartType: ChartType | any = 'bar';

  // بيانات المنتجات
  products = [
    { name: 'Home Decore Range', popularity: 78, color: '#FFC107' },
    { name: 'Disney Princess Dress', popularity: 62, color: '#a9dfd8' },
    { name: 'Bathroom Essentials', popularity: 51, color: '#03A9F4' },
    { name: 'Apple Smartwatch', popularity: 29, color: '#E91E63' },
  ];
  //end section tow
  //start section three

  //end section three
  //start section five
  // Current page signal
  currentPage = signal(1);

  // Number of items per page
  itemsPerPage = 4;

  // Total number of customers
  customers = signal([
    {
      name: 'Alex Xavier',
      email: 'alex@example.com',
      phone: '(555) 123-4567',
      address: '123 Elm Street, Springfield, IL',
      totalSpent: 981.0,
    },
    {
      name: 'Brian Edwards',
      email: 'brian@example.com',
      phone: '(555) 234-5678',
      address: '456 Oak Street, Lincoln, NE',
      totalSpent: 199.0,
    },
    {
      name: 'George Oliver',
      email: 'george@example.com',
      phone: '(555) 345-6789',
      address: '789 Maple Avenue, Madison, WI',
      totalSpent: 609.0,
    },
    {
      name: 'Isaac Neville',
      email: 'isaac@example.com',
      phone: '(555) 456-7890',
      address: '101 Pine Road, Orlando, FL',
      totalSpent: 923.0,
    },
    {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '(555) 555-5555',
      address: '789 Broadway, NYC, NY',
      totalSpent: 302.5,
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '(555) 222-4444',
      address: '123 Sunset Blvd, LA, CA',
      totalSpent: 500.0,
    },
    {
      name: 'Isaac Neville',
      email: 'isaac@example.com',
      phone: '(555) 456-7890',
      address: '101 Pine Road, Orlando, FL',
      totalSpent: 923.0,
    },
    {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '(555) 555-5555',
      address: '789 Broadway, NYC, NY',
      totalSpent: 302.5,
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '(555) 222-4444',
      address: '123 Sunset Blvd, LA, CA',
      totalSpent: 500.0,
    },
  ]);

  // Calculate total number of pages
  totalPages = computed(() =>
    Math.ceil(this.customers().length / this.itemsPerPage)
  );

  // Function to get visible customers for the current page
  visibleCustomers = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.customers().slice(start, end);
  });

  // Change the current page
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  // Create an array for page numbers
  getPagesArray() {
    return Array(this.totalPages())
      .fill(0)
      .map((x, i) => i + 1);
  }

  // Function to get a random color for the profile badge
  getColor(name: string): string {
    const colors = ['#28a745', '#dc3545', '#17a2b8', '#ffc107'];
    return colors[name.charCodeAt(0) % colors.length];
  }
}
