import { getContentMap } from '@/lib/site-content'

export default async function SwapVsDrive() {
  const content = await getContentMap({
    'events.swap_purpose': 'Let students browse and take free clothing.',
    'events.swap_what': 'Students attend an in-person event to browse, swap, and take items.',
    'events.drive_purpose': 'Collect clothing donations across campus.',
    'events.drive_what': 'Students donate clothing at bins or drives. The BU Campus Closet team sorts and stores items.',
    'events.guidelines': 'No undergarments, shoes, bedding, or accessories\nBring clean, gently-used clothing in good condition',
  })

  const guidelines = content['events.guidelines'].split('\n').filter(Boolean)

  return (
    <div className="w-full bg-white">
      <div className="mx-auto max-w-5xl p-8 font-body text-black">
        <p className="mb-10 text-center font-display text-5xl font-bold">
          Clothing Swap Vs. Drive
        </p>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-[20px] border-[3px] border-brand-dark-olive bg-brand-olive-light p-8 shadow-sm">
            <h2 className="mb-6 font-body text-[36px] font-extrabold">Clothing Swap</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold">Purpose</h3>
                <p className="text-sm">{content['events.swap_purpose']}</p>
              </div>
              <div>
                <h3 className="text-lg font-bold">What Happens</h3>
                <p className="text-sm">{content['events.swap_what']}</p>
              </div>
              <div>
                <h3 className="text-lg font-bold">When</h3>
                <p className="text-sm">On specific event dates.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold">Outcome</h3>
                <p className="text-sm">Students leave with free second-hand clothes.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[20px] border-[3px] border-brand-blue bg-brand-blue-light p-8 shadow-sm">
            <h2 className="mb-6 font-body text-[36px] font-extrabold">Clothing Drive</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold">Purpose</h3>
                <p className="text-sm">{content['events.drive_purpose']}</p>
              </div>
              <div>
                <h3 className="text-lg font-bold">What Happens</h3>
                <p className="text-sm">{content['events.drive_what']}</p>
              </div>
              <div>
                <h3 className="text-lg font-bold">When</h3>
                <p className="text-sm">Throughout the semester.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold">Outcome</h3>
                <p className="text-sm">Clothes are prepared for future swaps.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-4xl rounded-[20px] border-[3px] border-[rgba(197,184,174,0.8)] bg-brand-cream p-6 shadow-sm">
          <h2 className="mb-6 text-center text-2xl font-bold">General Guidelines for All Events</h2>
          <div className="flex flex-col items-center justify-center gap-4 text-sm md:flex-row md:gap-16">
            {guidelines.map((line) => (
              <div key={line} className="flex items-center gap-2">
                <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{line}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
