import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { Subscriber, Unsubscriber } from 'svelte/store';

export type TypedDispatch<T> = ThunkDispatch<T, any, AnyAction>;

export type Invalidator<T> = (value?: T) => void;

export type State$<T> = {
  subscribe: (
    this: void,
    run: Subscriber<T>,
    invalidate?: Invalidator<T>
  ) => Unsubscriber;
};

export type SetState<T> = (this: void, value: T) => void;
