'use client'

import { useEffect, useState } from 'react'

type MatchingMode = 'refugee_choice' | 'first_come' | 'auto'

interface Settings {
  matchingMode: MatchingMode
  platformFeePercent: number
  maintenanceMode: boolean
}

const MODES: { value: MatchingMode; label: string; description: string }[] = [
  {
    value: 'refugee_choice',
    label: 'Refugee Chooses',
    description: 'Refugee sees all applicants and picks one (Airbnb style)',
  },
  {
    value: 'first_come',
    label: 'First Come First Served',
    description: 'First student to apply gets auto-accepted',
  },
  {
    value: 'auto',
    label: 'Auto Match',
    description: 'Algorithm scores by language (50%) + proximity (30%) + rating (20%)',
  },
]

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => setSettings(d.settings))
  }, [])

  async function save() {
    if (!settings) return
    setSaving(true)
    setSaved(false)

    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!settings) return <div className="p-8 text-gray-500">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-2xl font-bold text-gray-800">Platform Settings</h1>

        {/* Matching Mode Toggle */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">Matching Mode</h2>
          <div className="space-y-3">
            {MODES.map((mode) => (
              <button
                key={mode.value}
                onClick={() => setSettings({ ...settings, matchingMode: mode.value })}
                className={`w-full rounded-xl border-2 p-4 text-left transition ${
                  settings.matchingMode === mode.value
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-4 w-4 rounded-full border-2 ${
                      settings.matchingMode === mode.value
                        ? 'border-indigo-500 bg-indigo-500'
                        : 'border-gray-400'
                    }`}
                  />
                  <div>
                    <p className="font-medium text-gray-800">{mode.label}</p>
                    <p className="text-sm text-gray-500">{mode.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Platform Fee */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">Platform Fee</h2>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={settings.platformFeePercent}
              onChange={(e) =>
                setSettings({ ...settings, platformFeePercent: Number(e.target.value) })
              }
              className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-center text-lg font-bold focus:border-indigo-500 focus:outline-none"
              min={0}
              max={50}
            />
            <span className="text-lg font-medium text-gray-700">%</span>
            <p className="text-sm text-gray-500">
              Platform takes {settings.platformFeePercent}% of each payment
            </p>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Maintenance Mode</h2>
              <p className="text-sm text-gray-500">Disable new requests and applications</p>
            </div>
            <button
              onClick={() =>
                setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })
              }
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                settings.maintenanceMode ? 'bg-red-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
