import type { Metadata } from 'next';
import { MyActionsScreen } from '@/features/enpath/my-actions/my-actions-screen';

export const metadata: Metadata = { title: 'My Actions · Enpath' };

export default function MyActionsPage() {
  return <MyActionsScreen />;
}
