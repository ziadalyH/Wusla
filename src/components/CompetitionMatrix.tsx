'use client'

const CHECK = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" fill="#0B6E68" fillOpacity="0.12"/>
    <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="#0B6E68" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CROSS = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" fill="#F3F4F6"/>
    <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#D1D5DB" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

const PARTIAL = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" fill="#FFF7ED"/>
    <path d="M5 8h6" stroke="#EA580C" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

const COLUMNS = [
  'Bilingual companions',
  'Paid model',
  'Refugee-specific',
  'On-demand',
  'Institution integration',
]

const ROWS = [
  {
    name: 'Status quo\n(WhatsApp / calls)',
    isWusla: false,
    cells: ['partial', false, false, false, false],
  },
  {
    name: 'GoVolunteer',
    isWusla: false,
    cells: [false, false, false, false, true],
  },
  {
    name: 'Ehrenamt24',
    isWusla: false,
    cells: [false, false, false, false, true],
  },
  {
    name: 'Integreat',
    isWusla: false,
    cells: [false, false, true, false, true],
  },
  {
    name: 'BAMF Sprachmittler',
    isWusla: false,
    cells: [true, 'partial', true, false, 'partial'],
  },
  {
    name: 'Careship',
    isWusla: false,
    cells: [false, true, false, true, false],
  },
  {
    name: 'Wusla',
    isWusla: true,
    cells: [true, true, true, true, true],
  },
]

function Cell({ value }: { value: boolean | string }) {
  if (value === 'partial') return <span className="flex justify-center">{PARTIAL}</span>
  if (value === true)      return <span className="flex justify-center">{CHECK}</span>
  return                          <span className="flex justify-center">{CROSS}</span>
}

export default function CompetitionMatrix() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">

      <p style={{ color: 'var(--student-primary)', letterSpacing: '0.1em' }}
         className="mb-3 text-xs font-semibold uppercase">
        Competitive Landscape
      </p>
      <h2 style={{ letterSpacing: '-0.03em' }}
          className="mb-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">
        No one else does all five.
      </h2>
      <p className="mb-10 text-base text-gray-500">
        Wusla is the only platform that combines bilingual matching, flexible pay, and on-demand availability — built specifically for refugees.
      </p>

      <div className="overflow-x-auto rounded-2xl shadow-md" style={{ border: '1px solid #E5E7EB' }}>
        <table className="w-full min-w-[600px] border-collapse bg-white">

          {/* Header */}
          <thead>
            <tr>
              <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide w-44">
                Platform
              </th>
              {COLUMNS.map((col) => (
                <th key={col} className="px-3 py-4 text-center text-xs font-semibold text-gray-500 leading-tight">
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {ROWS.map((row, i) => {
              const isLast = i === ROWS.length - 1
              return (
                <tr
                  key={row.name}
                  style={row.isWusla ? {
                    backgroundColor: 'var(--student-surface)',
                    borderTop: '2px solid var(--student-primary)',
                  } : {
                    borderTop: '1px solid #F3F4F6',
                  }}
                >
                  <td className="px-5 py-4">
                    <span
                      className="text-sm font-semibold whitespace-pre-line"
                      style={{ color: row.isWusla ? 'var(--student-primary)' : '#374151' }}
                    >
                      {row.name}
                    </span>
                  </td>
                  {row.cells.map((cell, j) => (
                    <td key={j} className="px-3 py-4 text-center">
                      <Cell value={cell} />
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>

        </table>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-5 border-t border-gray-100 bg-gray-50 px-5 py-3">
          <div className="flex items-center gap-1.5">{CHECK}<span className="text-xs text-gray-500">Yes</span></div>
          <div className="flex items-center gap-1.5">{PARTIAL}<span className="text-xs text-gray-500">Partial</span></div>
          <div className="flex items-center gap-1.5">{CROSS}<span className="text-xs text-gray-500">No</span></div>
        </div>
      </div>

    </section>
  )
}
