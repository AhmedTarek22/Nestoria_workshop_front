import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { OrdersComponent } from './orders/orders.component';
import { ProductsComponent } from './products/products.component';
import { ProfileComponent } from './profile/profile.component';
import { ChatComponent } from './chat/chat.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { WorkshopProfileComponent } from './work-shop-profile/work-shop-profile.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'dashboard/:token',
        component: DashboardComponent,
      },
      { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
      {
        path: 'products',
        component: ProductsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
      },
      { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },
      {
        path: 'workShopProfile',
        component: WorkshopProfileComponent,
        canActivate: [AuthGuard],
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', component: PagenotfoundComponent },
];
