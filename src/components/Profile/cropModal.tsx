import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { Button } from "../ui/button";

type CropModalProps = {
  open: boolean;
  imageSrc: string | null;
  crop: { x: number; y: number };
  zoom: number;
  onCropChange: (crop: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
  onCropComplete: (area: Area) => void;
  onClose: () => void;
  onSave: () => void;
};

export function CropModal({
  open,
  imageSrc,
  crop,
  zoom,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onClose,
  onSave,
}: CropModalProps) {
  if (!open || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-blur-sm">
      <div className="w-full max-w-lg bg-black rounded-2xl shadow-2xl p-6 ">

        <div className="relative w-full aspect-square bg-black overflow-hidden mb-8">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={(_, area) => onCropComplete(area)}
          />
        </div>    

       
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 "onClick={onSave}>
            Save
          </Button>
        </div>

      </div>
    </div>
  );
}