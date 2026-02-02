import { SidebarLayout } from '@/components/layout/sidebar-layout';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
