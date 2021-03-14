import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, debounceTime, filter, map, retry, throttleTime } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

import {
  BookMessage, BookMessageOrder,
  BookSubscriptionEvent,
  BookSubscriptionStatus,
  isEventMessage,
  Orders,
  ProductIds,
} from '../models/orders';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  /**
   * @type {string} apiPath - Websocket URL of the order book feed
   */
  private readonly apiPath = 'wss://www.cryptofacilities.com/ws/v1';
  /**
   * @type {string} feed - subscribe to this feed. The number defines the interval of fiat to group the orders by
   * TODO https://trello.com/c/BQpsgfcA/16 allow user to change grouping interval
   */
  private feed = 'book_ui_1';
  /**
   * @type {ProductIds[]} products - cyrpto-fiat pairs for which to get the order book
   */
  private products = [ProductIds.PI_XBTUSD];

  /**
   * @type {Orders} orders - the full list of orders to be returned to subscribers
   */
  private orders: Orders = {
    asks: {},
    bids: {},
    numLevels: 0,
  };
  /**
   * @type {number} retries - how many messages can fail before it actually errors
   */
  private retries = 5;
  /**
   * @type {WebSocketSubject<BookMessage>} websocket$ - The websocket Subject
   */
  private websocket$: WebSocketSubject<BookMessage>;

  constructor() {
    this.websocket$ = webSocket(this.apiPath);
  }

  /**
   * Returns the observable of the websocket
   * @returns {Observable<BookMessage>}
   */
  public get orders$(): Observable<Orders | null> {
    return this.websocket$.pipe(
      // Ignore a certain amount of failures
      retry(this.retries),
      map((message: BookMessage) => {
        if (isEventMessage(message)) {
          // Throw if the feed returns an error or if subscribing or unsubscribing to the feed fails
          if (
            message.event === BookSubscriptionStatus.error ||
            message.event === BookSubscriptionStatus.subscribed_failed ||
            message.event === BookSubscriptionStatus.unsubscribed_failed
          ) {
            // TODO https://trello.com/c/i1XmSSXY/17 add more information
            throwError(new Error(message.event));
          }

          return null;
        }

        if ('numLevels' in message && message.numLevels) {
          this.orders.numLevels = message.numLevels;
        }

        this.updateOrders(message.asks, 'asks');
        this.updateOrders(message.bids, 'bids');

        return this.orders;
      }),
      catchError(
        (err: Error): Observable<null> => {
          // TODO https://trello.com/c/i1XmSSXY/17 implement nice error handling
          console.error(err);
          return of(null);
        },
      ),
      // Filter out null (event messages and errors)
      filter<Orders | null>(Boolean),
    );
  }

  /**
   * Start subscription to the websocket
   */
  public connect(): void {
    this.sendEvent(BookSubscriptionEvent.subscribe);
  }

  /**
   * Start subscription to the websocket
   */
  public close(): void {
    this.sendEvent(BookSubscriptionEvent.unsubscribe);
  }

  /**
   * Sends a subsribe or unsubscribe event to the webservice
   * @param {BookSubscriptionEvent} event - 'subscribe' | 'unsubscribe'
   * @private
   */
  private sendEvent(event: BookSubscriptionEvent): void {
    this.websocket$.next({
      event,
      feed: this.feed,
      product_ids: this.products,
    });
  }

  /**
   * Update the asks or bids with new orders and reduce to `numLevels` of orders
   * @param {BookMessageOrder[]} orders
   * @param {"asks" | "bids"} orderType
   * @private
   */
  private updateOrders(orders: BookMessageOrder[], orderType: 'asks' | 'bids'): void {
    for (const [price, size] of orders) {
      // Storing the prices in cents ensures that decimals don't mess up the order
      this.orders[orderType][(price * 100).toString()] = size;
    }
    const newOrders: Record<string, number> = {};
    let i = 0;
    let prices = Reflect.ownKeys(this.orders[orderType]);
    if (orderType === 'bids') {
      prices = prices.reverse();
    }

    for (const price of prices) {
      const size = this.orders[orderType][price.toString()];
      if (size === 0) {
        continue;
      }
      if (i >= this.orders.numLevels) {
        break;
      }
      i++;
      newOrders[price.toString()] = size;
    }

    this.orders[orderType] = newOrders;
  }
}
