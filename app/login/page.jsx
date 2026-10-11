import LoginForm from "@/components/LoginForm";

export default function LoginPage({ searchParams }) {
  return <LoginForm nextPath={searchParams?.next || "/admin"} />;
}
