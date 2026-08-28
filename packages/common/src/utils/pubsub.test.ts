import { afterEach, describe, expect, test } from 'vitest';
import { pubsub } from './pubsub';

let eventId = 0;
const cleanups: Array<() => void> = [];

const createEventName = () => `pubsub-test-${++eventId}`;

const subscribe = (eventName: string, callback: (data: unknown) => void) => {
  const unsubscribe = pubsub.subscribe(eventName, callback);
  cleanups.push(unsubscribe);
  return unsubscribe;
};

describe('pubsub', () => {
  afterEach(() => {
    cleanups.splice(0).forEach(unsubscribe => unsubscribe());
  });

  test('removes the intended subscription after an earlier one is removed', () => {
    const eventName = createEventName();
    const calls: string[] = [];
    const unsubscribeA = subscribe(eventName, () => calls.push('a'));
    const unsubscribeB = subscribe(eventName, () => calls.push('b'));
    subscribe(eventName, () => calls.push('c'));

    unsubscribeA();
    unsubscribeB();
    pubsub.publish(eventName, null);

    expect(calls).toEqual(['c']);
  });

  test('does not skip the next subscriber when a callback unsubscribes itself', () => {
    const eventName = createEventName();
    const calls: string[] = [];
    let unsubscribeSelf = () => {};
    unsubscribeSelf = subscribe(eventName, () => {
      calls.push('self');
      unsubscribeSelf();
    });
    subscribe(eventName, () => calls.push('next'));

    pubsub.publish(eventName, null);
    pubsub.publish(eventName, null);

    expect(calls).toEqual(['self', 'next', 'next']);
  });

  test('treats duplicate callback registrations as independent subscriptions', () => {
    const eventName = createEventName();
    const calls: unknown[] = [];
    const callback = (data: unknown) => calls.push(data);
    const unsubscribeFirst = subscribe(eventName, callback);
    subscribe(eventName, callback);

    unsubscribeFirst();
    pubsub.publish(eventName, 'first');

    expect(calls).toEqual(['first']);
  });

  test('supports event names that collide with Object.prototype keys', () => {
    const eventNames = ['toString', 'constructor', '__proto__'];
    const calls: string[] = [];

    eventNames.forEach(eventName => {
      subscribe(eventName, () => calls.push(eventName));
    });
    eventNames.forEach(eventName => pubsub.publish(eventName, null));

    expect(calls).toEqual(eventNames);
  });

  test('makes unsubscribe idempotent', () => {
    const eventName = createEventName();
    const calls: unknown[] = [];
    const unsubscribe = subscribe(eventName, data => calls.push(data));

    unsubscribe();
    unsubscribe();
    pubsub.publish(eventName, 'ignored');

    expect(calls).toEqual([]);
  });
});
