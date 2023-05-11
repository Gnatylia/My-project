import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './components/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { AboutComponent } from './components/about/about.component';
import { StatisticComponent } from './components/statistic/statistic.component';
import { HeaderComponent } from './components/header/header.component';
import { ShoppingComponent } from './components/shopping/shopping.component';
import { CartComponent } from './components/cart/cart.component';
import { OrderComponent } from './components/order/order.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductComponent } from './components/product/product.component';
import { MatSelectModule } from '@angular/material/select';
import { MainAdminComponent } from './components/main-admin/main-admin.component';
import { FormProductComponent } from './components/form-product/form-product.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';
import { AdminWelcomeComponent } from './components/admin-welcome/admin-welcome.component';
import { ProductsViewComponent } from './components/products-view/products-view.component';
import { CategoryPanelComponent } from './components/category-panel/category-panel.component';
import { MatTabsModule } from '@angular/material/tabs';
import { CartPanelComponent } from './components/cart-panel/cart-panel.component';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { NotCartComponent } from './components/not-cart/not-cart.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AmountProductComponent } from './components/amount-product/amount-product.component';
import { MainOrderComponent } from './components/main-order/main-order.component';
import { OrderFormComponent } from './components/order-form/order-form.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { WelcomeShoppingComponent } from './components/welcome-shopping/welcome-shopping.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    RegisterComponent,
    AboutComponent,
    StatisticComponent,
    HeaderComponent,
    ShoppingComponent,
    CartComponent,
    OrderComponent,
    ProductsComponent,
    ProductComponent,
    MainAdminComponent,
    FormProductComponent,
    AdminPanelComponent,
    AdminHeaderComponent,
    AdminWelcomeComponent,
    ProductsViewComponent,
    CategoryPanelComponent,
    CartPanelComponent,
    CartItemComponent,
    NotCartComponent,
    AmountProductComponent,
    MainOrderComponent,
    OrderFormComponent,
    OrderSuccessComponent,
    WelcomeShoppingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatStepperModule,
    MatSelectModule,
    MatTabsModule,
    MatDialogModule, 
    MatDatepickerModule,
    MatNativeDateModule,
    
    ],
  providers: [],
  bootstrap: [AppComponent],
   //entryComponents: [AmountProductComponent]
})
export class AppModule { }
