import { AuthPage } from "@components/auth-page";

export default async function Login() {
  // if (data.authenticated) {
  //   redirect(data?.redirectTo || "/"); // expired stuff will lead to infinite loop
  // }

  return <AuthPage type="login" />;
}
