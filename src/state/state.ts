import { Item }  from '../models/item';
export interface State {
  input: string;
  content: Item [];
  loading: boolean;
  error: string;
}