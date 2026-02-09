import { Label } from '@/components/ui/label';
import { labelStyles, inputStyles } from '../lib/uiStyles';

interface ArtStyleSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ArtStyleSelect({ value, onChange }: ArtStyleSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="styleSelect" className={labelStyles}>
        Art Style
      </Label>
      <select
        id="styleSelect"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputStyles} w-full cursor-pointer`}
      >
        <option value="3D Pixar">3D Pixar Mode</option>
        <option value="Cyberpunk Neon">Cyberpunk Neon</option>
        <option value="Pencil Sketch">Pencil Sketch</option>
        <option value="Renaissance Oil">Oil Painting</option>
      </select>
    </div>
  );
}
