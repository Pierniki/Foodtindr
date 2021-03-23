import { Meal } from '.';

type RoomState = 'waiting' | 'loading' | 'done' | 'match';

type CommonAction = 'SET_LOADING' | 'SET_DONE' | 'SET_WAITING' | 'SET_MATCH';

export interface State {
  meal: Meal | null;
  mealDetails: any;
  users: string[];
  roomState: RoomState;
}

type Action =
  | { type: CommonAction }
  | { type: 'SET_MEAL'; meal: Meal }
  | { type: 'SET_MEAL_DETAILS'; mealDetails: any }
  | { type: 'ON_JOIN'; users: string[] };

const roomReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ON_JOIN':
      return {
        ...state,
        users: action.users,
        roomState: 'waiting',
      };
    case 'SET_WAITING':
      return {
        ...state,
        roomState: 'waiting',
      };
    case 'SET_LOADING':
      return {
        ...state,
        roomState: 'loading',
      };
    case 'SET_DONE':
      return {
        ...state,
        roomState: 'done',
      };
    case 'SET_MATCH':
      return {
        ...state,
        roomState: 'match',
      };
    case 'SET_MEAL':
      return {
        ...state,
        meal: action.meal,
      };
    case 'SET_MEAL_DETAILS':
      return {
        ...state,
        mealDetails: action.mealDetails,
      };

    default:
      return state;
  }
};

export default roomReducer;
