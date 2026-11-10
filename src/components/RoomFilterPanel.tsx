interface RoomFilterPanelProps {
  attendeesStr: string;
  onAttendeesChange: (value: string) => void;
  options: string[];
  selected: string[];
  onToggle: (item: string) => void;
  onClear: () => void;
}

export function RoomFilterPanel({
  attendeesStr,
  onAttendeesChange,
  options,
  selected,
  onToggle,
  onClear,
}: RoomFilterPanelProps) {
  const hasFilters = attendeesStr.trim() !== "" || selected.length > 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
        <div>
          <label
            htmlFor="attendees"
            className="mb-1.5 block text-xs font-medium text-slate-600"
          >
            Attendees
          </label>
          <input
            id="attendees"
            type="number"
            min={1}
            inputMode="numeric"
            placeholder="e.g. 20"
            value={attendeesStr}
            onChange={(e) => onAttendeesChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <fieldset>
          <legend className="mb-1.5 text-xs font-medium text-slate-600">
            Required equipment (all selected)
          </legend>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {options.map((item) => (
              <label
                key={item}
                className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-slate-700"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(item)}
                  onChange={() => onToggle(item)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                {item}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-3 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
