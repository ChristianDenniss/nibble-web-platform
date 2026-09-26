/**
 * HuePicker — brand hue + optional lightness range sliders for account color preferences; the lightness track renders a live gradient of the currently-selected hue.
 * Props: `hue`, `onChange`, and optional `lightness` + `onLightnessChange` (the lightness slider only renders when both are provided).
 * Lives in `components/inputs/`; used in account preferences to set the app's `--brand-hue`.
 */
interface Props {
  hue: number
  onChange: (hue: number) => void
  lightness?: number
  onLightnessChange?: (lightness: number) => void
}

export default function HuePicker({ hue, onChange, lightness, onLightnessChange }: Props) {
  return (
    <div className="space-y-3 w-full">
      <input
        type="range"
        min={0}
        max={360}
        value={hue}
        onChange={e => onChange(Number(e.target.value))}
        className="hue-slider w-full cursor-pointer"
      />
      {lightness !== undefined && onLightnessChange && (
        <input
          type="range"
          min={15}
          max={85}
          value={lightness}
          onChange={e => onLightnessChange(Number(e.target.value))}
          className="lightness-slider w-full cursor-pointer"
          style={{
            background: `linear-gradient(to right,
              hsl(var(--brand-hue), 64%, 15%),
              hsl(var(--brand-hue), 64%, 52%),
              hsl(var(--brand-hue), 64%, 85%)
            )`,
          }}
        />
      )}
    </div>
  )
}
