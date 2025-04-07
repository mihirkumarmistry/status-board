export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  groupClasses?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  link?: string;
  description?: string;
  path?: string;
  isAdminOnly?: boolean
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'general',
    title: 'General',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard',
        icon: 'dashboard',
      },
      {
        id: 'status-update',
        title: 'Status Update',
        type: 'item',
        classes: 'nav-item',
        url: '/status-update',
        icon: 'message',
      },
      {
        id: 'schedule',
        title: 'Schedule',
        type: 'item',
        classes: 'nav-item',
        url: '/schedule',
        icon: 'schedule',
      }
    ]
  }
];
