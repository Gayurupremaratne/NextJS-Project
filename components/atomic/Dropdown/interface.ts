export interface Item {
  id: number | string;
  name: string;
}
export interface BasicDropdownProps {
  items: Item[];
  onChange: (selectedValue: Item) => void;
  value: number;
}
export interface DropdownProps {
  placeholderText?: string;
  items: Item[];
  initialSelected?: Item;
  tabIndex: (index: number | string) => void;
  className?: string;
  disabled?: boolean;
}
export interface MultiDropdownProps {
  items: Item[];
  onSelectedItemsChange: (selectedItems: Item[]) => void;
  initialSelected?: Item[];
  placeholder?: string;
}
