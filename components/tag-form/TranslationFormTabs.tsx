import { TabDataItem, Tabs } from '../atomic';

interface TranslationFormTabsProps {
  formikProps: [];
  tabData: TabDataItem[];
  tabIndex: (index: number) => void;
}
const TranslationFormTabs = ({
  formikProps,
  tabData,
  tabIndex,
}: TranslationFormTabsProps) => {
  return (
    <Tabs
      formikProps={formikProps}
      intent="Secondary"
      tabData={tabData}
      tabIndex={tabIndex}
    />
  );
};

export default TranslationFormTabs;
