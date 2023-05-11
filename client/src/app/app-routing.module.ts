import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { CartComponent } from './components/cart/cart.component';
import { FormProductComponent } from './components/form-product/form-product.component';
import { LoginComponent } from './components/login/login.component';
import { MainAdminComponent } from './components/main-admin/main-admin.component';
import { MainOrderComponent } from './components/main-order/main-order.component';
import { MainComponent } from './components/main/main.component';
import { NotCartComponent } from './components/not-cart/not-cart.component';
import { OrderComponent } from './components/order/order.component';
import { ProductsComponent } from './components/products/products.component';
import { RegisterComponent } from './components/register/register.component';
import { ShoppingComponent } from './components/shopping/shopping.component';
import { StatisticComponent } from './components/statistic/statistic.component';
import { WelcomeShoppingComponent } from './components/welcome-shopping/welcome-shopping.component';

const routes: Routes = [
  //{ path: 'client', pathMatch: 'full'  },
  { path: 'admin', component: MainAdminComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'main', component: MainComponent },
  { path: 'login', component: LoginComponent },
  { path: 'about', component: AboutComponent },
  { path: 'statistic', component: StatisticComponent },
  { path: 'shopping', component: ShoppingComponent },
  { path: 'cart', component: CartComponent },
  { path: 'notCart', component: NotCartComponent },
  { path: 'order', component: OrderComponent },
  { path: 'mainOrder', component: MainOrderComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'welcomeShopping', component: WelcomeShoppingComponent },
  { path: "", pathMatch: "full", redirectTo: "main" },
  { path: "**", redirectTo: "main" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


