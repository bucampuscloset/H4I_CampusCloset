import React from 'react';
import Card from '@/components/ui/Card';
import { cn } from '@/lib/cn';

interface Event {
  id: string;
  title: string;
  type: string;
  date: Date;
  location: string;
  description: string;
  itemLimit: number;
  isPast: boolean;
}

interface EventCardProps {
  event: Event;
  colorIndex: number
}

export default function EventCard({ event, colorIndex }: EventCardProps) {
  const formattedDate = event.date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const colors = [
    "bg-brand-olive-light", "bg-brand-lavender-light", "bg-brand-tan-light"
  ]

  const chosenColor = colors[colorIndex % colors.length]

  
  return (
    <Card className="card-container flex flex-col overflow-hidden rounded-[20px] bg-white font-body shadow-xl">
      <div
        className={cn("top-placeholder flex h-56 items-center justify-center rounded-t-[20px]", chosenColor)}
      >
        <svg className="h-[72px] w-[72px] text-brand-text/40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 2a1 1 0 011 1v1h10V3a1 1 0 112 0v1h1a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm-2 8v10h16V10H4zm3 2h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8 4h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z" />
        </svg>
      </div>

      <div className="p-6 flex flex-col text-black">
        <p className="text-sm font-body font-extrabold text-brand-text">
          {formattedDate}
        </p>

        <h3 className="text-xl font-body font-extrabold">
          {event.title}
        </h3>

        <p className="text-brand-text/70 text-sm">
          {event.description}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-2">
          <p className="flex items-center gap-2 text-brand-text/80 text-sm">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span className="leading-tight">{event.location}</span>
          </p>
        </div>
      </div>
    </Card>
  );
}
