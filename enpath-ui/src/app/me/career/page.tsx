import type { Metadata } from 'next';
import { MyCareerScreen } from '@/features/enpath/my-career/my-career-screen';

export const metadata: Metadata = { title: 'My Career · Enpath' };

export default function MyCareerPage() {
  return <MyCareerScreen />;
}
