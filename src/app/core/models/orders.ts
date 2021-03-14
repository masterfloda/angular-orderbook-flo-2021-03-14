/**
 * Interfaces for the order book API
 * @see https://support.cryptofacilities.com/hc/en-us/articles/360000538773-Book
 */

/**
 * Basic interface for all messages
 */
interface BookMessageBase {
  feed: string;
  product_ids: ProductIds[];
}

/**
 * Asks and Bids that were placed since the last message
 */
interface BookMessageOrders extends BookMessageBase {
  asks: BookMessageOrder[];
  bids: BookMessageOrder[];
}

export type BookMessageOrder = [number, number];

/**
 * The first message from the server with `numLevel` asks and bids
 */
export interface BookMessageSnapshot extends BookMessageOrders {
  numLevels: number;
}

/**
 * Message sent to the websocket to subscribe/unsubscribe to the feed
 */
export interface BookMessageSubscription extends BookMessageBase {
  event: BookSubscriptionEvent;
}

/**
 * Subscription events that can be sent to the server
 */
export enum BookSubscriptionEvent {
  subscribe = 'subscribe',
  unsubscribe = 'unsubscribe',
}

/**
 * Subscription status message from the feed
 */
export interface BookMessageSubscriptionStatus extends BookMessageBase {
  event: BookSubscriptionStatus;
}

/**
 * Subscription events that get returned by the server
 */
export enum BookSubscriptionStatus {
  error = 'error',
  subscribed = 'subscribed',
  subscribed_failed = 'subscribed_failed',
  unsubscribed = 'unsubscribed',
  unsubscribed_failed = 'unsubscribed_failed',
}

/**
 * Version info message
 */
export interface BookMessageVersion {
  event: 'info';
  version: number;
}

/**
 * Union type for all event messages
 */
export type BookMessageEvent = BookMessageSubscription | BookMessageSubscriptionStatus | BookMessageVersion;

/**
 * Union type for all messages on the feed
 */
export type BookMessage = BookMessageEvent | BookMessageOrders | BookMessageSnapshot;

export enum ProductIds {
  PI_XBTUSD = 'PI_XBTUSD',
}

/**
 * Simplified map of buy/sells with the fiat interval as key and the size as value
 */
export interface Orders {
  asks: Order[];
  bids: Order[];
  numLevels: number;
}

// Aliases to make the type more readable
type price = number;
type size = number;
type total = number;
export type Order = [price, size, total];

/**
 * type guard for event messages
 * @param {BookMessage} message
 * @returns {message is BookMessageEvent}
 */
export function isEventMessage(message: BookMessage): message is BookMessageEvent {
  return 'event' in message;
}
