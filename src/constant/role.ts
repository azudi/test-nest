export const Roles = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
}

export type RolesType = typeof Roles[keyof typeof Roles];