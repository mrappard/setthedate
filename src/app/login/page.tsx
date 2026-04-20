import { redirect } from "next/navigation";
import { getSession } from "~/server/better-auth/server";
import { GoogleLoginButton } from "./login-form";

export default async function Login() {
  const session = await getSession();

  if (session) {
    redirect("/listEvents");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-slate-900 selection:bg-slate-100">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 text-center">
        
        {/* Logo/Title Section */}
        <div className="space-y-4">
          <h1 className="text-4xl font-extralight tracking-tighter sm:text-6xl text-slate-950">
            Set The <span className="font-semibold italic">Date</span>
          </h1>
          <p className="mx-auto max-sm text-sm font-light text-slate-500 uppercase tracking-widest">
            Identity Verification
          </p>
        </div>

        {/* Login Options Container */}
        <div className="w-full max-w-md space-y-4">
          <div className="p-8 rounded-2xl border border-slate-100 bg-slate-50/30 shadow-sm space-y-6">
            <h2 className="text-xl font-light text-slate-900">Sign in to your account</h2>
            
            <div className="space-y-3">
              <GoogleLoginButton />

              <button className="flex w-full items-center justify-center gap-3 h-12 rounded-full border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </button>

              <button className="flex w-full items-center justify-center gap-3 h-12 rounded-full border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Continue with LinkedIn
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className="bg-slate-50/30 px-2 text-slate-400">Or continue with</span>
              </div>
            </div>

            <button className="inline-flex w-full h-12 items-center justify-center rounded-full bg-slate-950 px-12 text-sm font-medium text-white transition-all hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-slate-200">
              Email & Password
            </button>
          </div>
          
          <p className="text-xs text-slate-400 font-light leading-loose">
            By continuing, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>

        {/* Footer */}
        <footer className="fixed bottom-8 text-[10px] font-medium tracking-[0.2em] uppercase text-slate-400">
          © {new Date().getFullYear()} Set The Date Studio
        </footer>
      </div>
    </main>
  );
}
