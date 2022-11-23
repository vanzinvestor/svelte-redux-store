# Svelte Redux Store

Use svelte with redux store. look like react-redux

[![npm version](https://badge.fury.io/js/svelte-redux-store.svg)](https://badge.fury.io/js/svelte-redux-store)

[Demo](https://stackblitz.com/edit/vitejs-vite-58jy3l?file=src%2FApp.svelte)

## Install

Install svelte-redux-store package

```bash
npm install svelte-redux-store
```

Install redux package

```bash
npm install redux redux-devtools-extension redux-thunk
```

## Use

### Step 1 Create svelte redux store

```ts
// src/store/store.ts
import { applyMiddleware, createStore, type Middleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducers from './reducers';
import {
  createUseEffect,
  createUseState,
  creatSvelteReduxStore,
} from 'svelte-redux-store'; //import this line
import { onMount } from 'svelte';

export type AppState = ReturnType<typeof rootReducers>;

const initialState = {};

const middleware: Middleware[] = [thunk];

const devTools =
  process.env.NODE_ENV === 'production'
    ? applyMiddleware(...middleware)
    : composeWithDevTools(applyMiddleware(...middleware));

export const store = createStore(rootReducers, initialState, devTools);

/**
 * If you use <Provider> (version 2.0.0 or latest).
 * you can import method from svelte-redux-store.
 * you don't have to create svelte redux store
 *
 */
// create svelte redux store
export const {
  useStore,
  useDispatch,
  useSelector,
  useFeatureSelector,
  useSubscribe,
} = creatSvelteReduxStore<AppState>(store);

// create useState (if you want)
export const { useState } = createUseState();
// OR
// import {useState} from 'svelte-redux-store'

// create useEffect (if you want)
export const { useEffect } = createUseEffect(onMount);
```

Remark: If you use rollup.js. Please see note in below

### Step 2 Wrapped app component with `<Provider {store}></Provider>` _version 2.0.0 or latest (If you want)_

```svelte
// src/Main.svelte
<script lang="ts">
  import { Provider } from 'svelte-redux-store';
  import App from './App.svelte';
  import { store } from './store/store';
</script>

<Provider {store}>
  <App />
</Provider>
```

```ts
// src/main.ts
import Main from './Main.svelte';

const main = new Main({
  target: document.getElementById('app'), // vite
  // target: document.body, // rollup
});

export default main;
```

### Step 3 Create counter action type

```ts
// src/store/actions/counter.actions.ts
export enum CountActionTypes {
  COUNTER_INCREMENT = '[Counter] Increment',
  COUNTER_DECREMENT = '[Counter] Decrement',
  COUNTER_RESET = '[Counter] Reset',
}

export interface CounterIncrementAction {
  readonly type: CountActionTypes.COUNTER_INCREMENT;
}

export interface CounterDecrementAction {
  readonly type: CountActionTypes.COUNTER_DECREMENT;
}

export interface CounterResetAction {
  readonly type: CountActionTypes.COUNTER_RESET;
}

export type Action =
  | CounterIncrementAction
  | CounterDecrementAction
  | CounterResetAction;
```

### Step 4 Create counter creator

```ts
// src/store/creators/counter.creators.ts
import type { Dispatch } from 'redux';
import { Action } from './../actions/counter.actions';

export const increment = () => async (dispatch: Dispatch<Action>) => {
  dispatch({ type: CountActionTypes.COUNTER_INCREMENT });
};

export const decrement = () => async (dispatch: Dispatch<Action>) => {
  dispatch({ type: CountActionTypes.COUNTER_DECREMENT });
};

export const reset = () => async (dispatch: Dispatch<Action>) => {
  dispatch({ type: CountActionTypes.COUNTER_RESET });
};
```

### Step 5 Create counter reducer

```ts
// src/store/reducers/counter.reducer.ts
import { Action, CountActionTypes } from './../actions/counter.actions';

interface CountState {
  count: number;
}

const initialCounterState: CountState = {
  count: 0,
};

export const counterReducer = (
  state: CountState = initialCounterState,
  action: Action
): CountState => {
  switch (action.type) {
    case CountActionTypes.COUNTER_INCREMENT:
      return { ...state, count: state.count + 1 };

    case CountActionTypes.COUNTER_DECREMENT:
      return { ...state, count: state.count - 1 };

    case CountActionTypes.COUNTER_RESET:
      return { ...state, count: 0 };

    default:
      return state;
  }
};
```

### Step 6 Create root reducer

```ts
// src/store/reducers/index.ts
import { combineReducers } from 'redux';
import { counterReducer } from './counter.reducer';

const rootReducers = combineReducers({
  counts: counterReducer,
});

export default rootReducers;
```

### Step 7 Use in components (App.svelte)

```svelte
// src/App.svelte
<script lang="ts">
  /**
  * If you use <Provider>.
  * you can import method from svelte-redux-store
  *
  */
  import {
     useDispatch,
     useFeatureSelector,
     useSelector,
     useState,
     useStore,
     useSubscribe,
   } from 'svelte-redux-store';
  import { decrement, increment, reset } from './store/creators';
  import {
    // useDispatch,
    // useFeatureSelector
    useEffect,
    // useSelector,
    // useState,
    // useStore,
    // useSubscribe,
    type AppState,
  } from './store/store';
  const store = useStore();
  // const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);

  const decrement = () => {
    store.dispatch(decrement());
    // dispatch(decrement());
  };

  const increment = () => {
    store.dispatch(increment());
    // dispatch(increment());
  };

  const count = store.selector((state: AppState) => state.count.count);

  // const count = useSelector((state: AppState) => state.counts.count);

  // const counts = useFeatureSelector('counts');

  // If use import useFeatureSelector from svelte-redux-store
  // const counts = useFeatureSelector<AppState>('counts');

  // let count:number
  // store.subscribe((state:AppState) => { count = state.counts.count })

  // let count:number
  // useSubscribe((state:AppState) => { count = state.counts.count })


  const handleClick = () => {
    setIsOpen(!$isOpen);

    if (!$isOpen && $count > 0) {
      store.dispatch(reset());
    }
  };

  useEffect(() => {
    alert('useEffect onMount');
  }, []);

  let value;

  $: useEffect(() => {
    if ($isOpen) {
      value = $count * 2;
    }
  }, [$isOpen, $count]);
</script>

<div class="app">
  <div class="home">
    <h1>Svelte State Management With Redux</h1>
    <div class="list">
      <div class="list-item">
        <p>Counter:</p>
        <div class="btn-group">
          <button class="btn" on:click={decrement}> - </button>
          <!-- USE SELECTOR -->
          <p>{$count}</p>
          <!-- <p>{$counts.count}</p> -->
          <!-- USE SUBSCRIBE -->
          <!-- <p>{count}</p> -->
          <button class="btn" on:click={increment}> + </button>
        </div>
      </div>
    </div>
    <h1>useState</h1>
    <div class="list">
      <div class="list-item">
        <button class="btn" on:click={handleClick}>
          {#if $isOpen}Close/Reset{:else}Show{/if}</button
        >
      </div>
    </div>
    <h1>useEffect</h1>
    <div class="list">
      <div class="list-item">
        {#if $isOpen}
          <h2>Value: {value}</h2>
        {/if}
      </div>
    </div>
  </div>
</div>

<style type="scss">
  .app {
    display: flex;
    justify-content: center;
    margin-top: 50px;
  }
  .home {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }

  .list-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px;
  }

  .btn-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 10px;
  }

  .btn-group p {
    padding: 10px;
  }

  .btn {
    padding: 5px 15px;
    font-size: 1rem;
    border: none;
    outline: none;
    background-color: #eee;
    border-radius: 5px;
    cursor: pointer;
  }

  .btn:hover {
    background-color: #ccc;
    transition: all 0.3 ease-in-out;
  }

  .btn:disabled {
    background-color: #f2f2f2;
    pointer-events: none;
  }
</style>
```

### Step 7 Install Redux DevTools Extension (Chrome Browser)

[Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd])

### Step 8 Chrome Browser And Press F12 (Developer tools) and See Redux tab

![Result](./svelte-redux-store-demo.png)

## Example App

[Counter App](https://github.com/vanzinvestor/example-svelte-redux-store-counter-app)

## Note: Make svelte support Redux

Install replace package

```bash
npm install @rollup/plugin-replace
```

Change `rollup.config.js`

```js
// rollup.config.js
import replace from '@rollup/plugin-replace'; // Import this

export default {
  // ...
  plugins: [
    // ...
    // Add this
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': production
        ? JSON.stringify('production')
        : JSON.stringify('development'),
    }),
    // ...
  ],
  // ...
};
```

## API

[useStore](useStore)
[useDispatch](useDispatch)
[useSelector](useSelector)
[useFeatureSelector](useFeatureSelector)
[useSubscribe](useFeatureSelector)
[useState](useState)
[useEffect](useEffect)

## Inspire by

[react-redux](https://github.com/reduxjs/react-redux)
[ngrx](https://github.com/ngrx/platform/tree/master/modules/store)
