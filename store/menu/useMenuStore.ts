import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface ISubMenuItem {
  name: string;
  routeTo: string;
  selected: boolean;
}

export interface IMenuItem {
  icon: string;
  name: string;
  routeTo?: string;
  selected?: boolean;
  expanded?: boolean;
  subMenuItems?: Array<ISubMenuItem>;
}

// NOTE: Each MenuItem icon name should align with iconsax-react icon name
const MenuItem: IMenuItem[] = [
  {
    icon: 'Home',
    name: 'Dashboard',
    routeTo: '/dashboard',
    selected: false,
  },
  {
    icon: 'Profile2User',
    name: 'Users',
    routeTo: '/users',
    selected: false,
  },
  {
    icon: 'Profile',
    name: 'Roles',
    routeTo: '/roles',
    selected: false,
  },
  {
    icon: 'Ticket',
    name: 'Inventory',
    routeTo: '/inventory',
    selected: false,
  },
  {
    icon: 'Map1',
    name: 'Trails',
    expanded: false,
    subMenuItems: [
      {
        routeTo: '/trails',
        name: 'Stages',
        selected: false,
      },
      {
        routeTo: '/points-of-interest',
        name: 'Points of interest',
        selected: false,
      },
      {
        routeTo: '/stories',
        name: 'Audio stories',
        selected: false,
      },
      {
        routeTo: '/tags',
        name: 'Tags',
        selected: false,
      },
      {
        routeTo: '/reported-images',
        name: 'Reported images',
        selected: false,
      },
    ],
  },
  {
    icon: 'Document',
    name: 'Content',
    expanded: false,
    subMenuItems: [
      {
        routeTo: '/policy',
        name: 'Policies',
        selected: false,
      },
      {
        routeTo: '/promotions',
        name: 'Promotions',
        selected: false,
      },
      {
        routeTo: '/content',
        name: 'Guidelines/conditions',
        selected: false,
      },
      {
        routeTo: '/badges',
        name: 'Achievements',
        selected: false,
      },
    ],
  },
  {
    icon: 'ClipboardText',
    name: 'Reports',
    expanded: true,
    subMenuItems: [
      {
        routeTo: '/reports/all-stage-passes-summary',
        name: 'All stage passes summary report',
        selected: false,
      },
      {
        routeTo: '/reports/stage-wise-summary',
        name: 'Stage wise summary report',
        selected: false,
      },
      {
        routeTo: '/reports/pass-cancellation-report',
        name: 'Cancelled passes report',
        selected: false,
      },
      {
        routeTo: '/reports/stages-closed-summary',
        name: 'Stages closed summary report',
        selected: false,
      },
    ],
  },
  {
    icon: 'NotificationBing',
    name: 'Notifications',
    routeTo: '/notifications',
    selected: false,
  },
  {
    icon: 'Setting2',
    name: 'Settings',
    routeTo: '/settings',
    selected: false,
  },
];

interface IMenuState {
  menu: IMenuItem[];
  setMenu: (menu: IMenuItem[]) => void;
  clear: () => void;
}

const initialState = {
  menu: [...MenuItem],
};

export const useMenuStore = create<IMenuState>()(
  devtools(
    set => ({
      ...initialState,
      setMenu: (menu: IMenuItem[]) => set(() => ({ menu })),
      clear: () =>
        set(() => ({
          ...initialState,
        })),
    }),
    {
      name: 'menu-store',
    },
  ),
);
