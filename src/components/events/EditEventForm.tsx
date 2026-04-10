'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/solid';
import { useApp } from '@/lib/context/AppContext';
import { formatTime } from '@/lib/data/helpers';
import type { Event, EventVisibility, EventTag, PosterTheme } from '@/lib/types';

interface EditEventFormProps {
  event: Event;
}

const posterThemePresets: (PosterTheme & { fontFamily: string })[] = [
  { background: 'linear-gradient(135deg, #a855f7, #ec4899)', fontColor: '#ffffff', fontFamily: 'font-bold' },
  { background: 'linear-gradient(135deg, #22d3ee, #a855f7)', fontColor: '#ffffff', fontFamily: 'font-bold' },
  { background: 'linear-gradient(135deg, #f97316, #ec4899)', fontColor: '#ffffff', fontFamily: 'font-bold' },
  { background: 'linear-gradient(135deg, #6366f1, #22d3ee)', fontColor: '#ffffff', fontFamily: 'font-bold' },
  { background: 'linear-gradient(135deg, #06060b, #6366f1)', fontColor: '#22d3ee', fontFamily: 'font-bold' },
  { background: 'linear-gradient(135deg, #ec4899, #f97316)', fontColor: '#ffffff', fontFamily: 'font-bold' },
  { background: 'linear-gradient(135deg, #22d3ee, #f97316)', fontColor: '#ffffff', fontFamily: 'font-bold' },
  { background: 'linear-gradient(135deg, #1a1a2e, #a855f7)', fontColor: '#ec4899', fontFamily: 'font-bold' },
];

const TAG_OPTIONS: EventTag[] = [
  'darty', 'formal', 'mixer', 'rush', 'philanthropy',
  'tailgate', 'party', 'concert', 'pregame', 'social',
];

const tagDisplayColors: Record<string, string> = {
  darty: 'border-amber-500/50 text-amber-400 bg-amber-500/10',
  formal: 'border-violet-500/50 text-violet-400 bg-violet-500/10',
  mixer: 'border-pink-500/50 text-pink-400 bg-pink-500/10',
  rush: 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10',
  philanthropy: 'border-rose-500/50 text-rose-400 bg-rose-500/10',
  tailgate: 'border-orange-500/50 text-orange-400 bg-orange-500/10',
  party: 'border-fuchsia-500/50 text-fuchsia-400 bg-fuchsia-500/10',
  concert: 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10',
  pregame: 'border-lime-500/50 text-lime-400 bg-lime-500/10',
  social: 'border-sky-500/50 text-sky-400 bg-sky-500/10',
};

const tagSelectedColors: Record<string, string> = {
  darty: 'border-amber-500 text-white bg-amber-500/30',
  formal: 'border-violet-500 text-white bg-violet-500/30',
  mixer: 'border-pink-500 text-white bg-pink-500/30',
  rush: 'border-emerald-500 text-white bg-emerald-500/30',
  philanthropy: 'border-rose-500 text-white bg-rose-500/30',
  tailgate: 'border-orange-500 text-white bg-orange-500/30',
  party: 'border-fuchsia-500 text-white bg-fuchsia-500/30',
  concert: 'border-cyan-500 text-white bg-cyan-500/30',
  pregame: 'border-lime-500 text-white bg-lime-500/30',
  social: 'border-sky-500 text-white bg-sky-500/30',
};

const VISIBILITY_OPTIONS: {
  value: EventVisibility;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: 'members_only',
    label: 'Members Only',
    description: 'Only execs and members of your org',
    icon: '🔒',
  },
  {
    value: 'friends_and_members',
    label: 'FoH & Members',
    description: 'Members plus friends of the house',
    icon: '🤝',
  },
  {
    value: 'open',
    label: 'Open',
    description: 'Anyone at the school can see and attend',
    icon: '🌍',
  },
];

function findMatchingThemeIndex(posterTheme: PosterTheme): number {
  const idx = posterThemePresets.findIndex(
    (p) => p.background === posterTheme.background && p.fontColor === posterTheme.fontColor,
  );
  return idx >= 0 ? idx : 0;
}

export function EditEventForm({ event }: EditEventFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userParam = searchParams.get('user');
  const { updateEvent } = useApp();

  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [date, setDate] = useState(event.date);
  const [startTime, setStartTime] = useState(event.startTime);
  const [endTime, setEndTime] = useState(event.endTime);
  const [location, setLocation] = useState(event.location);
  const [selectedTheme, setSelectedTheme] = useState(() => findMatchingThemeIndex(event.posterTheme));
  const [visibility, setVisibility] = useState<EventVisibility>(event.visibility);
  const [hasCapacity, setHasCapacity] = useState(event.capacity != null);
  const [capacity, setCapacity] = useState(event.capacity != null ? String(event.capacity) : '');
  const [selectedTags, setSelectedTags] = useState<EventTag[]>([...event.tags]);
  const [isPaid, setIsPaid] = useState(event.cost > 0);
  const [cost, setCost] = useState(event.cost > 0 ? String(event.cost) : '');

  const buildHref = (path: string) =>
    userParam ? `${path}?user=${userParam}` : path;

  const toggleTag = (tag: EventTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const isValid =
    title.trim() && date && startTime && endTime && location.trim();

  const handleSave = () => {
    if (!isValid) return;

    const theme = posterThemePresets[selectedTheme];
    updateEvent(event.id, {
      title: title.trim(),
      description: description.trim(),
      posterTheme: {
        background: theme.background,
        fontColor: theme.fontColor,
        fontFamily: theme.fontFamily,
      },
      date,
      startTime,
      endTime,
      location: location.trim(),
      visibility,
      capacity: hasCapacity && capacity ? parseInt(capacity, 10) : undefined,
      tags: selectedTags,
      cost: isPaid && cost ? parseFloat(cost) : 0,
    });

    router.push(buildHref(`/events/${event.id}`));
  };

  const theme = posterThemePresets[selectedTheme];

  return (
    <div className="px-5 py-6 space-y-6">
      {/* Title */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
          Event Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's the move?"
          className="w-full rounded-xl bg-dark-700 border border-dark-600 px-4 py-3 text-lg font-bold text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/50 transition-colors"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell people what to expect..."
          rows={3}
          className="w-full rounded-xl bg-dark-700 border border-dark-600 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/50 transition-colors resize-none"
        />
      </div>

      {/* Date + Time */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
          Date & Time
        </label>
        <div className="grid grid-cols-3 gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="col-span-3 rounded-xl bg-dark-700 border border-dark-600 px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/50 transition-colors [color-scheme:dark]"
          />
          <div className="col-span-1">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              placeholder="Start"
              className="w-full rounded-xl bg-dark-700 border border-dark-600 px-3 py-3 text-sm text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/50 transition-colors [color-scheme:dark]"
            />
            <span className="block text-[10px] text-gray-500 mt-1 text-center">Start</span>
          </div>
          <div className="col-span-1 flex items-start justify-center pt-3">
            <span className="text-gray-500 text-sm">to</span>
          </div>
          <div className="col-span-1">
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              placeholder="End"
              className="w-full rounded-xl bg-dark-700 border border-dark-600 px-3 py-3 text-sm text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/50 transition-colors [color-scheme:dark]"
            />
            <span className="block text-[10px] text-gray-500 mt-1 text-center">End</span>
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
          Location
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Where's it at?"
          className="w-full rounded-xl bg-dark-700 border border-dark-600 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/50 transition-colors"
        />
      </div>

      {/* Poster Theme */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
          Poster Vibe
        </label>
        <div className="grid grid-cols-4 gap-2">
          {posterThemePresets.map((preset, i) => (
            <button
              key={i}
              onClick={() => setSelectedTheme(i)}
              className={`relative h-16 rounded-xl border-2 transition-all ${
                selectedTheme === i
                  ? 'border-white shadow-lg scale-105'
                  : 'border-transparent hover:border-dark-600'
              }`}
              style={{ background: preset.background }}
            >
              {selectedTheme === i && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                    <CheckIcon className="h-4 w-4 text-dark-900" />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Visibility */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
          Who can see this?
        </label>
        <div className="space-y-2">
          {VISIBILITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setVisibility(opt.value)}
              className={`w-full flex items-center gap-3 rounded-xl border p-3 transition-all text-left ${
                visibility === opt.value
                  ? 'border-neon-purple bg-neon-purple/10'
                  : 'border-dark-600 bg-dark-700 hover:border-dark-600/80'
              }`}
            >
              <span className="text-lg">{opt.icon}</span>
              <div className="flex-1">
                <p
                  className={`text-sm font-semibold ${
                    visibility === opt.value ? 'text-white' : 'text-gray-300'
                  }`}
                >
                  {opt.label}
                </p>
                <p className="text-xs text-gray-500">{opt.description}</p>
              </div>
              {visibility === opt.value && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-neon-purple">
                  <CheckIcon className="h-3 w-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Capacity */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Capacity Limit
          </label>
          <button
            onClick={() => setHasCapacity(!hasCapacity)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              hasCapacity ? 'bg-neon-purple' : 'bg-dark-600'
            }`}
          >
            <motion.div
              animate={{ x: hasCapacity ? 20 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 h-4 w-4 rounded-full bg-white"
            />
          </button>
        </div>
        {hasCapacity && (
          <div>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="Max attendees"
              min="1"
              className="w-full rounded-xl bg-dark-700 border border-dark-600 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/50 transition-colors"
            />
          </div>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {TAG_OPTIONS.map((tag) => {
            const selected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                  selected
                    ? tagSelectedColors[tag]
                    : tagDisplayColors[tag]
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cost */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Cover Charge
          </label>
          <button
            onClick={() => setIsPaid(!isPaid)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              isPaid ? 'bg-neon-purple' : 'bg-dark-600'
            }`}
          >
            <motion.div
              animate={{ x: isPaid ? 20 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 h-4 w-4 rounded-full bg-white"
            />
          </button>
        </div>
        {isPaid && (
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              $
            </span>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full rounded-xl bg-dark-700 border border-dark-600 pl-8 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/50 transition-colors"
            />
          </div>
        )}
        {!isPaid && (
          <p className="text-xs text-gray-500">Free event</p>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-dark-600" />

      {/* Preview */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Poster Preview
        </label>
        <div
          className="relative rounded-2xl overflow-hidden h-48"
          style={{ background: theme.background }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_60%)]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <h3
              className="text-xl font-extrabold leading-tight"
              style={{ color: theme.fontColor }}
            >
              {title || 'Event Title'}
            </h3>
            {date && (
              <p
                className="text-sm mt-1 opacity-80"
                style={{ color: theme.fontColor }}
              >
                {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
                {startTime && ` \u00b7 ${formatTime(startTime)}`}
              </p>
            )}
            {location && (
              <p
                className="text-xs mt-0.5 opacity-60"
                style={{ color: theme.fontColor }}
              >
                {location}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.01 }}
        onClick={handleSave}
        disabled={!isValid}
        className="w-full rounded-xl px-6 py-4 text-base font-bold text-white shadow-lg shadow-neon-purple/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all"
        style={{
          background: isValid
            ? 'linear-gradient(135deg, #a855f7, #ec4899)'
            : undefined,
          backgroundColor: isValid ? undefined : '#1a1a2e',
        }}
      >
        Save Changes
      </motion.button>
    </div>
  );
}
