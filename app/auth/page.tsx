import Image from "next/image";
import { redirect } from "next/navigation";
import { authClient } from "@/app/_lib/auth-client";
import { headers } from "next/headers";
import { SignInWithGoogle } from "./_components/sign-in-with-google";

export default async function AuthPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (session.data?.user) redirect("/");

  return (
    <div className="relative flex min-h-svh flex-col bg-black lg:flex-row">
      {/* Image - mobile */}
      <div className="absolute inset-0 overflow-hidden lg:hidden">
        <Image
          src="/login-bg-mobile.png"
          alt=""
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Image - desktop */}
      <div className="relative hidden flex-1 overflow-hidden lg:block">
        <Image
          src="/login-bg.png"
          alt=""
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Logo - mobile */}
      <div className="relative z-10 flex justify-center pt-12 lg:hidden">
        <Image src="/fit-ai-logo.svg" alt="FIT.AI" width={85} height={38} />
      </div>

      <div className="flex-1 lg:hidden" />

      <div className="relative z-10 flex flex-col items-center gap-15 rounded-t-4xl bg-primary px-5 pb-10 pt-12 lg:w-110 lg:shrink-0 lg:justify-center lg:rounded-none lg:gap-10">
        <div className="flex w-full flex-col items-center gap-6">
          {/* Logo - desktop */}
          <div className="hidden lg:block">
            <Image src="/fit-ai-logo.svg" alt="FIT.AI" width={85} height={38} />
          </div>

          <h1 className="w-full text-center font-heading text-[32px] font-semibold leading-[1.05] text-primary-foreground">
            O app que vai transformar a forma como você treina.
          </h1>

          <SignInWithGoogle />
        </div>

        <p className="font-heading text-xs leading-[1.4] text-primary-foreground/70">
          ©2026 Copyright FIT.AI. Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}
