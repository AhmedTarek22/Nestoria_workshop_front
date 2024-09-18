import { Component } from '@angular/core';
import {
  ChartData,
  ChartOptions,
  ChartType,
  ChartConfiguration,
} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css',
})
export class BarChartComponent {
  /*   // إعدادات البيانات المستخدمة في الرسم البياني
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'],
    datasets: [
      {
        label: 'Volume',
        data: [79, 65, 48, 54, 70],
        backgroundColor: 'rgba(72, 207, 173, 0.8)',
        hoverBackgroundColor: 'rgba(72, 207, 173, 1)',
      },
      {
        label: 'Service',
        data: [78, 55, 60, 40, 65],
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        hoverBackgroundColor: 'rgba(54, 162, 235, 1)',
      },
    ],
  };

  // إعدادات الرسم البياني
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            // إظهار بيانات العمود عند التحويم
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
  };

  public barChartType: ChartType | any = 'bar';
*/

  // إعداد نوع الرسم البياني كـ "خط"
  public lineChartType: ChartType | any = 'line';

  // إعداد البيانات والإعدادات للرسم البياني
  public lineChartData: ChartData<'line'> = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'This Month',
        data: [600, 500, 960, 700, 650, 820, 950],
        // borderColor: '#42A5F5',
        // backgroundColor: 'rgba(66, 165, 245, 0.2)',
        tension: 0.4,
        fill: true, // لتلوين المنطقة تحت الخط
      },
      {
        label: 'Last Month',
        data: [400, 600, 884, 680, 620, 790, 870],
        // borderColor: '#9C27B0',
        // backgroundColor: 'rgba(156, 39, 176, 0.2)',
        tension: 0.4,
        fill: true, // لتلوين المنطقة تحت الخط
      },
    ],
  };

  // إعداد خيارات الرسم البياني
  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: false, // إلغاء تفعيل الـ tooltip الافتراضي لعرض tooltip مخصص
        external: (context) => {
          const tooltipModel = context.tooltip;
          if (tooltipModel.opacity === 0) {
            this.hideCustomTooltip();
            return;
          }
          const position = context.chart.canvas.getBoundingClientRect();
          this.showCustomTooltip(
            position.left + tooltipModel.caretX,
            position.top + tooltipModel.caretY,
            tooltipModel.dataPoints[0].label,
            tooltipModel.dataPoints[0].formattedValue
          );
        },
      },
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
    // التعامل مع الضغط على النقاط لعرض بياناتها
    onClick: (event, elements, chart) => {
      if (elements.length > 0) {
        const elementIndex = elements[0].index;
        const datasetIndex = elements[0].datasetIndex;

        // التحقق من وجود labels و data قبل الاستخدام
        const label = chart.data.labels
          ? chart.data.labels[elementIndex]
          : 'N/A';
        const value =
          chart.data.datasets[datasetIndex].data[elementIndex] !== undefined
            ? chart.data.datasets[datasetIndex].data[elementIndex]
            : 'N/A';

        // alert(`Label: ${label}\nValue: ${value}`); 
      }
    },
  };
  Math: any;

  // دالة لإظهار الـ tooltip المخصص عند تمرير الفأرة
  showCustomTooltip(x: number, y: number, label: string, value: string) {
    const tooltip = document.getElementById('customTooltip');
    tooltip!.style.left = `${x}px`;
    tooltip!.style.top = `${y}px`;
    tooltip!.innerHTML = `<b>${label}</b><br> Value: ${value}`;
    tooltip!.style.display = 'block';
  }

  // دالة لإخفاء الـ tooltip عند عدم التمرير
  hideCustomTooltip() {
    const tooltip = document.getElementById('customTooltip');
    tooltip!.style.display = 'none';
  }
}