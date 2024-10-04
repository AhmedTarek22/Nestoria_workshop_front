
import { Component, signal, computed, OnInit } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from '../services/profile.service';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective, BarChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  balance!: number;
  allDetails!: any;
  allProductsLength!: number;
  customers = signal([]);
  customersA!: any;
  productsSoldLength!: number;
  currentPage = signal(1);
  itemsPerPage = 4;
  topSoldProducts!: any;
  totalSoldPrice!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private http: HttpClient,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'] || localStorage.getItem('token');
      if (token) {
        localStorage.setItem('token', token);
        this.router.navigate([`/dashboard/${token}`]);
      } else {
        window.location.href = 'http://localhost:3000/login';
      }
    });

    this.fetchBalance();
    this.getAllDetails();
  }

  fetchBalance() {
    this.http
      .get('http://localhost:5000/api/v1/admin/get-balance')
      .subscribe((res: any) => {
        this.balance = res.sellerBalance
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      });
  }

  getAllDetails() {
    this.dashboardService.getAllDetails().subscribe((details) => {
      this.allDetails = details;
      this.allProductsLength = details.allProducts.length;
      this.customers.set(details.customers);
      this.customersA = details.customers;
      this.productsSoldLength = details.deliveredProducts.length;
      this.topSoldProducts = details.topSoldProducts;
      this.totalSoldPrice = details.totalSoldValue;
      console.log(details);
    });
  }

  // إعدادات الرسم البياني
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const datasetLabel = context.dataset.label || '';
            const data = context.raw;
            return `${datasetLabel}: ${data}`;
          },
        },
      },
    },
    scales: {
      x: {},
      y: { beginAtZero: true },
    },
  };

  public barChartData: ChartData<'bar'> = {
    labels: ['Level 1', 'Level 2', 'Level 3', 'Level 4'],
    datasets: [
      { label: 'Volume', data: [79, 80, 75, 90], backgroundColor: '#72d7d2' },
      { label: 'Service', data: [78, 81, 70, 95], backgroundColor: '#43425D' },
    ],
  };

  public barChartType: ChartType = 'bar';

  // حساب إجمالي عدد الصفحات
  totalPages = computed(() =>
    Math.ceil(this.customers().length / this.itemsPerPage)
  );

  // الحصول على العملاء المرئيين للصفحة الحالية
  visibleCustomers = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.customers().slice(start, start + this.itemsPerPage);
  });

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  getPagesArray() {
    return Array(this.totalPages())
      .fill(0)
      .map((x, i) => i + 1);
  }

  getColor(name: string): string {
    const colors = ['#28a745', '#dc3545', '#17a2b8', '#ffc107'];
    return colors[name.charCodeAt(0) % colors.length];
  }

  // بيانات المنتجات
  products = [
    { name: 'Home Decore Range', popularity: 78, color: '#FFC107' },
    { name: 'Disney Princess Dress', popularity: 62, color: '#a9dfd8' },
    { name: 'Bathroom Essentials', popularity: 51, color: '#03A9F4' },
    { name: 'Apple Smartwatch', popularity: 29, color: '#E91E63' },
  ];
}
