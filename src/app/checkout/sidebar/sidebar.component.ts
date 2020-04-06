import {Component, OnInit} from '@angular/core';

import {CartService} from '../../cart/shared/cart.service';
import {CartItem} from '../../models/cart-item.model';

@Component({
  selector: 'app-checkout-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public cartSubtotal: number;
  public shipping: number;
  public orderTotal: number;

  public itensCart: CartItem[];

  constructor(private cartService: CartService) {
  }

  ngOnInit() {
    this.itensCart = this.cartService.getItems();
    this.orderTotal = this.cartService.getTotal();
    this.cartSubtotal = 0;
    this.shipping = 0;
  }
}
