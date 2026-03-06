import LoginPanel from '@/components/LoginPanel';

export const metadata = {
  title: 'Login | WaferWiki v2'
};

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-lg">
      <LoginPanel />
    </div>
  );
}
