# Svelte Redux Store

## Install

```bash
npm install svelte-redux-store
```

## Use

### Step 1 Create redux store

```ts
// store/store.ts
import { applyMiddleware, createStore, type Middleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducers from './reducers';
import { creatReduxStore } from 'svelte-redux-store'; //import this line

export type AppState = ReturnType<typeof rootReducers>;

const initialState = {};

const middleware: Middleware[] = [thunk];

const devTools =
  process.env.NODE_ENV === 'production'
    ? applyMiddleware(...middleware)
    : composeWithDevTools(applyMiddleware(...middleware));

const store = createStore(rootReducers, initialState, devTools);

export const {
  useStore,
  useDispatch,
  useSelector,
  useFeatureSelector,
  useSubscribe,
} = creatReduxStore<AppState>(store);
```

### Step 2 Create counter action type

```ts
// store/actions/couter.actions.ts
export enum CountActionTypes {
  COUNTER_INCREMENT = '[Counter] Increment',
  COUNTER_DECREMENT = '[Counter] Decrement',
}

export interface CounterIncrementAction {
  readonly type: CountActionTypes.COUNTER_INCREMENT;
}

export interface CounterDecrementAction {
  readonly type: CountActionTypes.COUNTER_DECREMENT;
}

export type Action = CounterIncrementAction | CounterDecrementAction;
```

### Step 3 Create counter creator

```ts
// store/creators/couter.creators.ts
import type { Dispatch } from 'redux';
import { Action } from './../actions/couter.actions';

export const increment = () => async (dispatch: Dispatch<Action>) => {
  dispatch({ type: CountActionTypes.COUNTER_INCREMENT });
};

export const decrement = () => async (dispatch: Dispatch<Action>) => {
  dispatch({ type: CountActionTypes.COUNTER_DECREMENT });
};
```

### Step 4 Create counter reducer

```ts
import { Action, CountActionTypes } from './../actions/couter.actions';

// store/reducers/couter.reducer.ts
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

    default:
      return state;
  }
};
```

### Step 5 Create root reducer

```ts
// store/reducers/index.ts
import { combineReducers } from 'redux';
import { counterReducer } from './counter.reducer';

const rootReducers = combineReducers({
  counts: counterReducer,
});

export default rootReducers;
```

### Step 6 Use in components (App.svelte)

```svelte
// App.svelte
<script lang="ts">
  import { increment, decrement } from './store/creators';
   import { useDispatch,useSelector, useStore, useSubscribe, type AppState } from './store/store';
  const store = useStore();
  // const dispatch = useDispatch();

  const decrement = () => {
    store.dispatch(decrement());
    // dispatch(decrement());
  };

  const increment = () => {
    store.dispatch(increment());
    // dispatch(increment());
  };

  const count = store.selector((state: AppState) => state.counts.count);

  // const count = useSelector((state: AppState) => state.counts.count);

  // let count:number
  // store.subscribe((state:AppState) => { count = state.counts.count })

  // let count:number
  // useSubscribe((state:AppState) => { count = state.counts.count })
</script>

<div class="app">
  <div class="home">
    <h1>State Management With Redux</h1>
    <div class="list">
      <div class="list-item">
        <p>Counter:</p>
        <div class="btn-group">
          <button class="btn" on:click={decrement}> - </button>
          <p>{$count}</p>  <!-- USE SELECTOR -->
          <!-- <p>{count}</p> -->  <!-- USE SUBSCRIBE -->
          <button class="btn" on:click={increment}> + </button>
        </div>
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

## Example App

[Counter App]()

## Inspire by

[react-redux](https://github.com/reduxjs/react-redux)
[ngrx](https://github.com/ngrx/platform/tree/master/modules/store)
