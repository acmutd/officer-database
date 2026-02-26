import React from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { RotateCcw, RotateCw } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export type ImageAdjustments = {
  brightness: number;
  contrast: number;
  saturation: number;
};

type CropModalProps = {
  open: boolean;
  imageSrc: string | null;
  crop: { x: number; y: number };
  zoom: number;
  rotation: number;
  outputSize: number;
  adjustments: ImageAdjustments;
  onCropChange: (crop: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
  onRotationChange: (rotation: number) => void;
  onOutputSizeChange: (size: number) => void;
  onAdjustmentChange: (key: keyof ImageAdjustments, value: number) => void;
  onResetAdjustments: () => void;
  onCropComplete: (area: Area) => void;
  onClose: () => void;
  onSave: () => void;
  isSaving: boolean;
};

export function CropModal({
  open,
  imageSrc,
  crop,
  zoom,
  rotation,
  outputSize,
  adjustments,
  onCropChange,
  onZoomChange,
  onRotationChange,
  onOutputSizeChange,
  onAdjustmentChange,
  onResetAdjustments,
  onCropComplete,
  onClose,
  onSave,
  isSaving,
}: CropModalProps) {
  if (!open || !imageSrc) return null;

  const cropViewportSize = 420;
  const wheelZoomSpeed = 0.2;
  const [minZoomLevel, setMinZoomLevel] = React.useState(1);

  const filterStyle = `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%)`;

  const handleMediaLoaded = React.useCallback(
    ({
      width,
      height,
    }: {
      width: number;
      height: number;
    }) => {
      const fittedMinZoom = Math.max(
        cropViewportSize / width,
        cropViewportSize / height
      );
      setMinZoomLevel(fittedMinZoom);

      if (zoom < fittedMinZoom) {
        onZoomChange(fittedMinZoom);
      }
    },
    [onZoomChange, zoom]
  );

  const applyPreset = (preset: "original" | "vivid" | "bw" | "warm") => {
    if (preset === "original") {
      onResetAdjustments();
      return;
    }

    if (preset === "vivid") {
      onAdjustmentChange("brightness", 105);
      onAdjustmentChange("contrast", 115);
      onAdjustmentChange("saturation", 130);
      return;
    }

    if (preset === "bw") {
      onAdjustmentChange("brightness", 100);
      onAdjustmentChange("contrast", 120);
      onAdjustmentChange("saturation", 0);
      return;
    }

    onAdjustmentChange("brightness", 108);
    onAdjustmentChange("contrast", 104);
    onAdjustmentChange("saturation", 92);
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="dark w-[92vw] max-w-[92vw] sm:max-w-5xl h-[80vh] grid-rows-[auto_minmax(0,1fr)_auto] p-0 gap-0 overflow-hidden border-border bg-background text-foreground"
      >
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>Edit photo</DialogTitle>
        </DialogHeader>

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="relative bg-muted/20">
            <div className="absolute inset-0">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                minZoom={minZoomLevel}
                maxZoom={4}
                zoomSpeed={wheelZoomSpeed}
                rotation={rotation}
                aspect={1}
                cropSize={{ width: 420, height: 420 }}
                cropShape="round"
                showGrid={false}
                objectFit="contain"
                restrictPosition
                onMediaLoaded={handleMediaLoaded}
                style={{
                  mediaStyle: {
                    filter: filterStyle,
                  },
                }}
                onCropChange={onCropChange}
                onZoomChange={onZoomChange}
                onCropComplete={(_, pixels) => onCropComplete(pixels)}
              />
            </div>
          </div>

          <div className="border-l bg-muted/20 p-5 overflow-y-auto">
            <Tabs defaultValue="crop" className="h-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="crop">Crop</TabsTrigger>
                <TabsTrigger value="filter">Filter</TabsTrigger>
                <TabsTrigger value="adjust">Adjust</TabsTrigger>
              </TabsList>

              <TabsContent value="crop" className="mt-5 space-y-6">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Zoom</div>
                  <Input
                    type="range"
                    min={minZoomLevel}
                    max={4}
                    step={0.01}
                    value={zoom}
                    onChange={(event) =>
                      onZoomChange(Number(event.target.value))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Rotate</div>
                    <div className="text-sm text-muted-foreground">
                      {Math.round(rotation)}°
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => onRotationChange(rotation - 90)}
                    >
                      <RotateCcw />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => onRotationChange(rotation + 90)}
                    >
                      <RotateCw />
                    </Button>
                  </div>
                  <Input
                    type="range"
                    min={-180}
                    max={180}
                    step={1}
                    value={rotation}
                    onChange={(event) =>
                      onRotationChange(Number(event.target.value))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Output size</div>
                    <div className="text-sm text-muted-foreground">
                      {outputSize}px
                    </div>
                  </div>
                  <Input
                    type="range"
                    min={320}
                    max={1080}
                    step={10}
                    value={outputSize}
                    onChange={(event) =>
                      onOutputSizeChange(Number(event.target.value))
                    }
                  />
                </div>
              </TabsContent>

              <TabsContent value="filter" className="mt-5 space-y-3">
                <div className="text-sm font-medium">Presets</div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => applyPreset("original")}
                  >
                    Original
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => applyPreset("vivid")}
                  >
                    Vivid
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => applyPreset("bw")}
                  >
                    B&amp;W
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => applyPreset("warm")}
                  >
                    Warm
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="adjust" className="mt-5 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Brightness</div>
                    <div className="text-sm text-muted-foreground">
                      {adjustments.brightness}%
                    </div>
                  </div>
                  <Input
                    type="range"
                    min={50}
                    max={150}
                    step={1}
                    value={adjustments.brightness}
                    onChange={(event) =>
                      onAdjustmentChange(
                        "brightness",
                        Number(event.target.value)
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Contrast</div>
                    <div className="text-sm text-muted-foreground">
                      {adjustments.contrast}%
                    </div>
                  </div>
                  <Input
                    type="range"
                    min={50}
                    max={150}
                    step={1}
                    value={adjustments.contrast}
                    onChange={(event) =>
                      onAdjustmentChange(
                        "contrast",
                        Number(event.target.value)
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Saturation</div>
                    <div className="text-sm text-muted-foreground">
                      {adjustments.saturation}%
                    </div>
                  </div>
                  <Input
                    type="range"
                    min={0}
                    max={200}
                    step={1}
                    value={adjustments.saturation}
                    onChange={(event) =>
                      onAdjustmentChange(
                        "saturation",
                        Number(event.target.value)
                      )
                    }
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={onResetAdjustments}
                >
                  Reset adjustments
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={onSave} disabled={isSaving}>
            Save photo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}