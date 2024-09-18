import 'zone.js'; 
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; 


interface Order {
  id: number;
  product: string;
  price: number;
  customerName: string;
  orderDate: Date;
  shipped: boolean;
  sent: boolean; 
  imageUrl: string; 
  quantity: number; 
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent {
  orders = signal<Order[]>([
    {
      id: 1,
      product: 'Laptop',
      price: 1500,
      customerName: 'John Doe',
      orderDate: new Date(),
      shipped: false,
      sent: false, 
      imageUrl: 'https://via.placeholder.com/50x50?text=Laptop', 
      quantity: 1, 
    },
  ]);

  // قائمة الطلبات المشحونة
  shippedOrders: Order[] = [];

  // التبويب النشط - بداية يكون 'pending'
  activeTab = 'pending';

  // دالة لتحديد التبويب النشط
  selectTab(tab: string) {
    this.activeTab = tab;
  }

  // دالة لشحن الطلب
  shipOrder(id: number) {
    this.orders.update((orders) => {
      // تحديث الطلب كـ shipped ونقله إلى قائمة shippedOrders
      const updatedOrders = orders.map((order) => {
        if (order.id === id) {
          order.shipped = true; // تغيير حالة الشحن
          order.sent = false; // لم يتم الإرسال بعد
          this.shippedOrders.push(order); // إضافة الطلب لقائمة الطلبات المشحونة
        }
        return order;
      });

      // حذف الطلب من قائمة الطلبات المعلقة
      return updatedOrders.filter((order) => order.id !== id);
    });
  }

  // دالة لإرسال الطلب بعد شحنه
  sendOrder(id: number) {
    this.orders.update((orders) => {
      return orders.map((order) => {
        if (order.id === id) {
          order.sent = true; // تغيير حالة الإرسال
        }
        return order;
      });
    });
  }

  // دالة لحذف الطلب نهائيًا من قائمة الطلبات المعلقة
  deleteOrder(id: number) {
    this.orders.update(
      (orders) => orders.filter((order) => order.id !== id) // حذف الطلب
    );
  }

  // دالة لحذف الطلب نهائيًا من قائمة الطلبات المشحونة وأيضًا من قائمة الطلبات المعلقة
  cancelOrder(id: number) {
    // حذف الطلب من قائمة الطلبات المشحونة
    this.shippedOrders = this.shippedOrders.filter((order) => order.id !== id);

    // حذف الطلب من قائمة الطلبات المعلقة
    this.orders.update((orders) => orders.filter((order) => order.id !== id));
  }
}
