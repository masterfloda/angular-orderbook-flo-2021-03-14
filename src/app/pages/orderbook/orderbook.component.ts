import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { Orders } from '../../core/models/orders';

import { OrdersService } from '../../core/services/orders.service';

@Component({
  selector: 'app-orderbook',
  templateUrl: './orderbook.component.html',
  styleUrls: ['./orderbook.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderbookComponent implements OnDestroy, OnInit {
  public orders$: Observable<Orders | null> | undefined;

  constructor(private ordersService: OrdersService) {}

  public ngOnInit(): void {
    // Throttle the updates of the table to 10 times a second
    this.orders$ = this.ordersService.orders$.pipe(throttleTime(100));

    this.ordersService.connect();
  }

  public ngOnDestroy(): void {
    this.ordersService.close();
  }
}
