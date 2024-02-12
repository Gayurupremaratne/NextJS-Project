export interface TabDataItem {
  title: string | JSX.Element;
  content: string | JSX.Element;
}

export interface TabsProps {
  tabData: TabDataItem[];
  intent: 'Primary' | 'Secondary';
  formikProps?: [];
  tabIndex: (index: number) => void;
  initialSelected?: number;
  disabledIndex?: number;
}
