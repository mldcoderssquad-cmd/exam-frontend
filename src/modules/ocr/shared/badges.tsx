import type { OCRConfidence, MappingStatus } from '@/types'

export function ConfidenceBadge({ confidence }: { confidence: OCRConfidence }) {
  const cfg = {
    High: 'bg-[#D1FAE5] text-[#065F46] border-[#A7F3D0]',
    Medium: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
    Low: 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]',
  }[confidence]
  const icon = { High: '●', Medium: '◐', Low: '○' }[confidence]
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg}`}>
      <span className="text-[10px]">{icon}</span> {confidence}
    </span>
  )
}

export function MappingBadge({ status }: { status: MappingStatus }) {
  const cfg = {
    'Mapped': 'bg-[#D1FAE5] text-[#065F46]',
    'Needs Review': 'bg-[#FEF3C7] text-[#92400E]',
    'Not Found': 'bg-[#FEE2E2] text-[#991B1B]',
  }[status]
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cfg}`}>{status}</span>
}
