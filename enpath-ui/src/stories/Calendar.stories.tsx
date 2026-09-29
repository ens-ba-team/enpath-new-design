import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { Calendar, CalendarWithPresets, CalendarWithTime } from '@/components/ui/calendar';

// Spec: calendar.meta.json

const meta = {
  title: 'Display/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Single date (Type=Default) ────────────────────────────────────────────────

export const Default: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
      />
    );
  },
};

// ─── Range (Type=Range) ────────────────────────────────────────────────────────

export const Range: Story = {
  render: () => {
    const [range, setRange] = React.useState<DateRange | undefined>({
      from: new Date(),
      to: addDays(new Date(), 7),
    });
    return (
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        numberOfMonths={2}
      />
    );
  },
};

// ─── No selection ──────────────────────────────────────────────────────────────

export const NoSelection: Story = {
  render: () => <Calendar mode="single" />,
};

// ─── With disabled dates ───────────────────────────────────────────────────────

export const WithDisabledDates: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>();
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={[
          { dayOfWeek: [0, 6] }, // weekends
          { before: new Date() }, // past dates
        ]}
      />
    );
  },
};

// ─── Outside days hidden ───────────────────────────────────────────────────────

export const OutsideDaysHidden: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>();
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        showOutsideDays={false}
      />
    );
  },
};

// ─── Type=Presets ──────────────────────────────────────────────────────────────

export const Presets: Story = {
  render: () => <CalendarWithPresets />,
};

// ─── Type=Date-Time Picker ────────────────────────────────────────────────────

export const DateTimePicker: Story = {
  render: () => <CalendarWithTime />,
};
