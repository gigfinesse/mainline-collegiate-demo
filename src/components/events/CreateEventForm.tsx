'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/solid';
import { useApp } from '@/lib/context/AppContext';
import { formatTime } from '@/lib/data/helpers';
import type { Event, EventVisibility, EventTag, PosterTheme } from '@/lib/types';

interface CreateEventFormProps {
  orgId: string;
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
  darty: 'border-neon-orange/50 text-neon-orange bg-neon-orange/10',
  formal: 'border-neon-indigo/50 text-neon-indigo bg-neon-indigo/10',
  mixer: 'border-neon-pink/50 text-neon-pink bg-neon-pink/10',
  rush: 'border-neon-cyan/50 text-neon-cyan bg-neon-cyan/10',
  philanthropy: 'border-neon-purple/50 text-neon-purple bg-neon-purple/10',
  tailgate: 'border-neon-orange/50 text-neon-orange bg-neon-orange/10',
  party: 'border-neon-pink/50 text-neon-pink bg-neon-pink/10',
  concert: 'border-neon-cyan/50 text-neon-cyan bg-neon-cyan/10',
  pregame: 'border-neon-indigo/50 text-neon-indigo bg-neon-indigo/10',
  social: 'border-neon-purple/50 text-neon-purple bg-neon-purple/10',
};

const tagSelectedColors: Record<string, string> = {
  darty: 'border-neon-orange text-white bg-neon-orange/30',
  formal: 'border-neon-indigo text-white bg-neon-indigo/30',
  mixer: 'border-neon-pink text-white bg-neon-pink/30',
  rush: 'border-neon-cyan text-white bg-neon-cyan/30',
  philanthropy: 'border-neon-purple text-white bg-neon-purple/30',
  tailgate: 'border-neon-orange text-white bg-neon-orange/30',
  party: 'border-neon-pink text-white bg-neon-pink/30',
  concert: 'border-neon-cyan text-white bg-neon-cyan/30',
  pregame: 'border-neon-indigo text-white bg-neon-indigo/30',
  social: 'border-neon-purple text-white bg-neon-purple/30',
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

export function CreateEventForm({ orgId }: CreateEventFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userParam = searchParams.get('user');
  const { currentUser, createEvent, rsvpToEvent } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [visibility, setVisibility] = useState<EventVisibility>('friends_and_members');
  const [hasCapacity, setHasCapacity] = useState(false);
  const [capacity, setCapacity] = useState('');
  const [selectedTags, setSelectedTags] = useState<EventTag[]>([]);
  const [isPaid, setIsPaid] = useState(false);
  const [cost, setCost] = useState('');

  const buildHref = (path: string) =>
    userParam ? `${path}?user=${userParam}` : path;

  const toggleTag = (tag: EventTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const isValid =
    title.trim() && date && startTime && endTime && location.trim();

  const handlePublish = () => {
    if (!currentUser || !isValid) return;

    const theme = posterThemePresets[selectedTheme];
    const newEvent: Event = {
      id: 'evt-' + Date.now(),
      orgId,
      createdByUserId: currentUser.id,
      title: title.trim(),
      description: description.trim(),
      coverImageUrl: '',
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
      createdAt: new Date().toISOString(),
    };

    createEvent(newEvent);
    rsvpToEvent(newEvent.id);
    router.push(buildHref(`/orgs/${orgId}`));
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
          {posterThemePresets.map((theme, i) => (
            <button
              key={i}
              onClick={() => setSelectedTheme(i)}
              className={`relative h-16 rounded-xl border-2 transition-all ${
                selectedTheme === i
                  ? 'border-white shadow-lg scale-105'
                  : 'border-transparent hover:border-dark-600'
              }`}
              style={{ background: theme.background }}
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

      {/* Publish Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.01 }}
        onClick={handlePublish}
        disabled={!isValid}
        className="w-full rounded-xl px-6 py-4 text-base font-bold text-white shadow-lg shadow-neon-purple/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all"
        style={{
          background: isValid
            ? 'linear-gradient(135deg, #a855f7, #ec4899)'
            : undefined,
          backgroundColor: isValid ? undefined : '#1a1a2e',
        }}
      >
        Publish Event
      </motion.button>
    </div>
  );
}
