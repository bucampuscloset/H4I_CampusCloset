'use client';
import { useState } from "react";
import { Calendar, dateFnsLocalizer, type ToolbarProps } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomToolbar({ label, onNavigate }: ToolbarProps<any>) {
  return (
    <div className="mb-2 flex items-center justify-between px-2 py-3">
      <button
        onClick={() => onNavigate('PREV')}
        className="text-[24px] text-brand-text/70 hover:text-brand-text"
        aria-label="Previous month"
      >
        &lsaquo;
      </button>
      <span className="font-body text-[20px] font-extrabold text-brand-text">
        {label.split(' ')[0]}
      </span>
      <button
        onClick={() => onNavigate('NEXT')}
        className="text-[24px] text-brand-text/70 hover:text-brand-text"
        aria-label="Next month"
      >
        &rsaquo;
      </button>
    </div>
  );
}

interface Event {
  id: string;
  title: string;
  type: string;
  date: Date;
  location: string;
  description: string;
  itemLimit: number;
}

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface EventCalendarProps {
  events: Event[];
}

export default function EventCalendar({ events }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentMonthEvents = events.filter((event) => {
    return (
      event.date.getMonth() === currentDate.getMonth() &&
      event.date.getFullYear() === currentDate.getFullYear()
    );
  });

  const groupedEvents = currentMonthEvents.reduce((acc: Record<string, Event[]>, event) => {
    const key = event.date.toDateString();
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {});

  function formatHeader(date: Date) {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }

  function formatTime(date: Date) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  const calendarEvents = events.map((e) => ({
    title: e.title,
    start: e.date,
    end: e.date,
  }));

  const currentMonthString = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="flex justify-between bg-white p-10">
      
      <div className="ml-5 mt-[30px] w-[60%]">
        <h2 className="mb-0 font-display text-[48px]">
          Calendar
        </h2>
        <p className="mb-[30px] font-body text-brand-text/60">
          (Events for {currentMonthString})
        </p>

        {Object.keys(groupedEvents).length === 0 && (
          <p className="font-body text-brand-text/50">
            No events scheduled for this month.
          </p>
        )}

        {Object.entries(groupedEvents).map(([dateStr, dayEvents]) => {
          const date = new Date(dateStr);

          return (
            <div key={dateStr} className="mb-[30px]">
              <h2 className="mb-2.5 font-body text-[20px] font-extrabold">
                {formatHeader(date)}
              </h2>

              <div className="mb-2.5 border-b border-gray-300" />

              {dayEvents.map((event, idx) => (
                <div key={`${event.id}-${idx}`} className="mb-2 flex gap-5">
                  <span className="w-20 font-body">
                    {formatTime(event.date)}
                  </span>
                  <span className="font-body">
                    {event.title} ({event.location})
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div className="h-[500px] w-[35%] overflow-hidden rounded-xl">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          views={["month"]}
          date={currentDate}
          onNavigate={(newDate) => setCurrentDate(newDate)}
          className="h-full font-body"
          components={{ toolbar: CustomToolbar }}
        />
      </div>

    </div>
  );
}
