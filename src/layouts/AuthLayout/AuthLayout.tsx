import type { ReactNode } from "react";
import {
  ShieldCheck,
  Bot,
  CheckCircle,
  ClipboardList,
} from "lucide-react";
import { ExamEvaluateLogo } from "@/components/common";

export function AuthLayout({
  children,
  panel,
}: {
  children: ReactNode;
  panel?: ReactNode;
}) {
  const features = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-blue-300" />,
      text: "Role-based access for Faculty, HOD, Dean & Admin",
    },
    {
      icon: <Bot className="w-5 h-5 text-violet-300" />,
      text: "AI-assisted answer evaluation with confidence scoring",
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-emerald-300" />,
      text: "Multi-tier faculty and HOD verification workflow",
    },
    {
      icon: <ClipboardList className="w-5 h-5 text-amber-300" />,
      text: "Immutable audit trail for every evaluation action",
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Brand Panel */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] flex-col bg-[#0F2142] relative overflow-hidden shrink-0">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#3B5DE8]/20 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -left-20 w-60 h-60 bg-[#1B3A6B]/40 rounded-full blur-2xl" />

        <div className="relative flex flex-col h-full p-10">
          <ExamEvaluateLogo size="md" inverse />

          <div className="flex-1 flex flex-col justify-center mt-16">
            {panel || (
              <>
                <h1 className="font-['DM_Serif_Display'] text-4xl text-white leading-snug mb-4">
                  Secure Academic
                  <br />
                  Examination Platform
                </h1>

                <p className="text-blue-200 text-base leading-relaxed mb-10">
                  A trusted institutional system for end-to-end examination
                  evaluation — from question papers to verified final results.
                </p>

                <div className="space-y-5">
                  {features.map((feature) => (
                    <div
                      key={feature.text}
                      className="flex items-start gap-4"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10 shrink-0">
                        {feature.icon}
                      </div>

                      <span className="text-blue-100 text-sm leading-relaxed">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="mt-10 pt-6 border-t border-white/10">
            <p className="text-blue-300 text-xs">
              © 2026 University Examination Board · Confidential · Authorized
              Users Only
            </p>
          </div>
        </div>
      </div>

      {/* Right Content Panel */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-[#F8FAFC]">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="flex justify-center mb-8 lg:hidden">
              <ExamEvaluateLogo size="md" />
            </div>

            {children}
          </div>
        </div>

        <div className="py-4 text-center">
          <p className="text-xs text-[#94A3B8]">
            © 2026 University Examination Board · Authorized Access Only
          </p>
        </div>
      </div>
    </div>
  );
}