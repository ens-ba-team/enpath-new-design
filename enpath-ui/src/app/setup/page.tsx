import type { Metadata } from 'next';
import { SetupScreen } from '@/features/enpath/setup/setup-screen';

export const metadata: Metadata = { title: 'Setup · Enpath' };

export default async function SetupPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const initialTab = tab === 'matrices' || tab === 'paths' ? tab : 'structure';
  return <SetupScreen initialTab={initialTab} />;
}
