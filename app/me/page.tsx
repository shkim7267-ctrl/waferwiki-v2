import { getSearchDocs } from '@/lib/search-data';
import MeDashboard from '@/components/MeDashboard';

export const metadata = {
  title: 'My Page | WaferWiki v2'
};

export default function MePage() {
  const docs = getSearchDocs();
  return <MeDashboard docs={docs} />;
}
