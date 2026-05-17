'use client'

import Accordion from '@/components/ui/Accordion'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

const helpSections = [
  {
    question: 'Getting Started',
    answer:
      'The admin portal is where you manage everything visitors see on the Campus Closet website. Use the sidebar on the left to navigate between sections like Events, Team, FAQ, Photos, and more. The Dashboard gives you a quick overview with links to every section.',
  },
  {
    question: 'Managing Events',
    answer:
      'Go to Events in the sidebar to create, edit, or delete events. Each event has a title, date, time, location, and description. You can set the event type to Swap, Drive, or Meeting. Swaps are clothing exchange events, Drives are donation collection events, and Meetings are team or planning sessions. To edit or delete an event, click on it in the list.',
  },
  {
    question: 'Managing the Team',
    answer:
      'Go to Team in the sidebar to add or remove team members. Each member has a name, role, and photo. You can upload a headshot for each person. To reorder members, edit their details, or remove someone from the page, use the controls next to each entry.',
  },
  {
    question: 'Managing FAQs',
    answer:
      'Go to FAQ in the sidebar to add, edit, or remove frequently asked questions. Each FAQ has a question, an answer, and a category. Categories help organize questions on the public FAQ page so visitors can find what they need quickly.',
  },
  {
    question: 'Uploading Photos',
    answer:
      'Go to Photos in the sidebar to upload images to the gallery. Supported formats are JPG, PNG, WebP, and GIF. The maximum file size is 4 MB per image. Uploaded photos appear on the public Events page gallery for visitors to browse.',
  },
  {
    question: 'Editing Site Content',
    answer:
      'Go to Site Content in the sidebar to change the text that appears on the public website. You can update headings, descriptions, and other copy across all public-facing pages. After saving, changes typically take about 1 minute to appear on the live site.',
  },
  {
    question: 'Impact Statistics',
    answer:
      'Go to Impact in the sidebar to log environmental impact data after each event. You can enter the number of items swapped, pounds of clothing diverted from landfills, and other metrics. These numbers are displayed on the public site to show the difference Campus Closet is making.',
  },
  {
    question: 'Donation Bins',
    answer:
      'Go to Donation Bins in the sidebar to manage bin locations on campus. You can add new bins with a name, building, and description. Each bin can be toggled between active and inactive -- inactive bins are hidden from the public map.',
  },
  {
    question: 'Contact Inbox',
    answer:
      "Go to Contact Inbox in the sidebar to view messages submitted through the public contact form. You can see each message's details, update its status (new, read, replied), and click Reply to open your email client with the sender's address pre-filled.",
  },
  {
    question: 'Adding New Admins',
    answer:
      'To give someone admin access, go to Admin Users in the sidebar and enter their Google email address. Once added, they can log in to the admin portal using that Google account. Only people whose emails are in the admin list can access the portal.',
  },
  {
    question: 'Troubleshooting',
    answer:
      "Can't log in? Your Google email must be added to the admin list first -- ask a current admin to add you. Changes not showing on the public site? Wait about 60 seconds and refresh the page. Photo won't upload? Make sure the file is under 4 MB and is a JPG, PNG, WebP, or GIF.",
  },
]

export default function AdminHelpPage() {
  return (
    <div>
      <AdminPageHeader
        title="Help"
        subtitle="A quick guide to managing the Campus Closet website."
        accentColor="bg-brand-blue"
      />

      <Accordion items={helpSections} allowMultiple className="max-w-3xl" />
    </div>
  )
}
