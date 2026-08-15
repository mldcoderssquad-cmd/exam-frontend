// src/modules/answer-key/AnswerKeyManager.tsx

import { AppShell } from '@/layouts'
import { useState } from 'react'
import { Card, Button, ArrowLeftIcon } from '@/components/common'
import type { User, Screen } from '@/types'
import StepCreateAnswerKey from './create/StepCreateAnswerKey'
import StepAnswerKeyList from './list/StepAnswerKeyList'

interface AnswerKeyManagerProps {
  user: User
  onNavigate: (s: Screen, data?: any) => void
  onLogout: () => void
  initialScreen?: 'create' | 'list'
}

export default function AnswerKeyManager({ 
  user, 
  onNavigate, 
  onLogout, 
  initialScreen = 'create' 
}: AnswerKeyManagerProps) {
  const [activeTab, setActiveTab] = useState<'create' | 'list'>(initialScreen)

  return (
    <AppShell
      user={{ name: user.name, role: user.role, email: user.email }}
      onNavigate={onNavigate}
      onLogout={onLogout}
      activeSection="answer-key"
    >
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Answer Key Management</h1>
            <p className="text-sm text-[#475569] mt-0.5">Create and manage answer keys for examinations.</p>
          </div>
          <button
            onClick={() => onNavigate('dashboard-faculty')}
            className="flex items-center gap-1.5 text-sm text-[#475569] hover:text-[#1B3A6B] font-medium transition-colors"
          >
            <ArrowLeftIcon size={14} /> Back to Dashboard
          </button>
        </div>

        {/* Tabs */}
        <Card className="p-0 overflow-hidden">
          <div className="flex border-b border-[#E2E8F0]">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-3 text-sm font-semibold transition-all ${
                activeTab === 'create'
                  ? 'text-[#1B3A6B] border-b-2 border-[#1B3A6B] bg-[#EEF4FF]'
                  : 'text-[#94A3B8] hover:text-[#475569]'
              }`}
            >
              ✏️ Create New Answer Key
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-6 py-3 text-sm font-semibold transition-all ${
                activeTab === 'list'
                  ? 'text-[#1B3A6B] border-b-2 border-[#1B3A6B] bg-[#EEF4FF]'
                  : 'text-[#94A3B8] hover:text-[#475569]'
              }`}
            >
              📋 My Answer Keys
            </button>
          </div>
        </Card>

        {/* Content */}
        {activeTab === 'create' && (
          <StepCreateAnswerKey 
            onSave={() => setActiveTab('list')}
            onCancel={() => onNavigate('dashboard-faculty')}
          />
        )}
        {activeTab === 'list' && (
          <StepAnswerKeyList 
            onSelect={(id) => {
              onNavigate('ocr-workflow', { examId: id })
            }}
            onEdit={(id) => {
              // Navigate to edit (optional)
            }}
            onDelete={(id) => {
              // Handle delete
            }}
          />
        )}
      </div>
    </AppShell>
  )
}