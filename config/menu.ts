export type MenuItem = {
  title: string;
  href: string;
  icon: string;
};

export const adminMenus: MenuItem[] = [
  {
    title: "用户管理",
    href: "/admin/users",
    icon: "users",
  },
];