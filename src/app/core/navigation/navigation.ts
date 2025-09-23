/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation'

export const defaultNavigation: FuseNavigationItem[] = [
  {
    id: 'admin-management',
    title: 'Admin Management',
    permissions: ['super', 'admin-permission-read', 'admin-role-read', 'admin-user-read'],
    type: 'group',
    icon: 'heroicons_outline:cog-6-tooth',
    children: [
      {
        id: 'admin-permission',
        title: 'Permissions',
        permissions: ['super', 'admin-permission-read'],
        type: 'basic',
        icon: 'heroicons_outline:key',
        link: '/admin-permission',
      },
      {
        id: 'admin-role',
        title: 'Roles',
        permissions: ['super', 'admin-role-read'],
        type: 'basic',
        icon: 'heroicons_outline:shield-check',
        link: '/admin-role',
      },
      {
        id: 'admin-user',
        title: 'Admins',
        permissions: ['super', 'admin-user-read'],
        type: 'basic',
        icon: 'heroicons_outline:users',
        link: '/admin-user',
      },
    ],
  },
  {
    id: 'course-management',
    title: 'Course Management',
    permissions: ['super', 'sp-category-read', 'sp-level-read', 'sp-courses-read', 'sp-materials-read', 'sp-tests-read'],
    type: 'group',
    icon: 'heroicons_outline:academic-cap',
    children: [
      {
        id: 'sp-category',
        title: 'Categories',
        permissions: ['super', 'sp-category-read'],
        type: 'basic',
        icon: 'heroicons_outline:squares-2x2',
        link: '/sp-category',
      },
      {
        id: 'sp-level',
        title: 'Levels',
        permissions: ['super', 'sp-level-read'],
        type: 'basic',
        icon: 'heroicons_outline:signal',
        link: '/sp-level',
      },
      {
        id: 'sp-courses',
        title: 'Courses',
        permissions: ['super', 'sp-courses-read'],
        type: 'basic',
        icon: 'heroicons_outline:play-circle',
        link: '/sp-courses',
      },
      {
        id: 'sp-materials',
        title: 'Materials',
        permissions: ['super', 'sp-materials-read'],
        type: 'basic',
        icon: 'heroicons_outline:document-text',
        link: '/sp-materials',
      },
      {
        id: 'sp-tests',
        title: 'Tests',
        permissions: ['super', 'sp-tests-read'],
        type: 'basic',
        icon: 'heroicons_outline:clipboard-document-check',
        link: '/sp-tests',
      },
    ],
  },
  {
    id: 'system-settings',
    title: 'System Settings',
    permissions: ['super', 'translation-read'],
    type: 'group',
    icon: 'heroicons_outline:cog-8-tooth',
    children: [
      {
        id: 'translation',
        title: 'Translations',
        permissions: ['super', 'translation-read'],
        type: 'basic',
        icon: 'heroicons_outline:language',
        link: '/translation',
      },
    ],
  },
]