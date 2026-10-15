import type { Metadata } from 'next';
import { RecordsScreen } from '@/features/enpath/records/records-screen';

export const metadata: Metadata = { title: 'Records · Enpath' };

export default function RecordsPage() {
  return <RecordsScreen />;
}
