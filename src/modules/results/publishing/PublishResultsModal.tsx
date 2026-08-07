import { Modal, Button } from '@/components/common'
import type { DEPARTMENTS as DEPARTMENTS_TYPE } from '@/services/dean/mockData'
import { Rocket, AlertTriangle } from 'lucide-react'

type Department = (typeof DEPARTMENTS_TYPE)[number]

export function PublishResultsModal({
  department,
  onClose,
  onConfirm,
}: {
  department: Department
  onClose: () => void
  onConfirm: (deptId: string) => void
}) {
  return (
    <Modal open onClose={onClose} maxWidth="max-w-md">
      <div className="p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#F3E8FF] flex items-center justify-center shrink-0">
            <Rocket size={24} className="text-[#7C3AED]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0F172A]">Approve & Publish Results</h3>
            <p className="text-sm text-[#475569] mt-1">
              <strong>{department.name}</strong> — {department.completed.toLocaleString()} evaluated sheets
            </p>
          </div>
        </div>
        <div className="p-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-lg text-xs text-[#92400E] flex items-start gap-2">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <span>This action is irreversible. Results will be locked and published to the student portal once approved.</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-[#F8FAFC] rounded-lg">
            <div className="text-base font-bold text-[#059669]">{department.avgMarks}</div>
            <div className="text-[10px] text-[#94A3B8]">Avg Marks</div>
          </div>
          <div className="p-2 bg-[#F8FAFC] rounded-lg">
            <div className="text-base font-bold text-[#3B5DE8]">{department.passPercent}%</div>
            <div className="text-[10px] text-[#94A3B8]">Pass Rate</div>
          </div>
          <div className="p-2 bg-[#F8FAFC] rounded-lg">
            <div className="text-base font-bold text-[#DC2626]">{department.rejected}</div>
            <div className="text-[10px] text-[#94A3B8]">Rejected</div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="md" fullWidth onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="md" fullWidth onClick={() => onConfirm(department.id)}>
            Confirm & Publish
          </Button>
        </div>
      </div>
    </Modal>
  )
}