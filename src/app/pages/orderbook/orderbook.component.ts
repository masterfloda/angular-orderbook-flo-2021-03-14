import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-orderbook',
  templateUrl: './orderbook.component.html',
  styleUrls: ['./orderbook.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderbookComponent {}
