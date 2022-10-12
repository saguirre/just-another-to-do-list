import { Todo } from "./todo";

export interface OptionMenuItem {
  label: string;
  action: (item: OptionMenuItem, itemAttachedToOptions?: Todo) => void;
  className?: string;
  loading?: boolean;
  icon: any;
}
