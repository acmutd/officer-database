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

type FilterPreset = {
  id:
    | "original"
    | "studio"
    | "spotlight"
    | "prime"
    | "classic"
    | "edge"
    | "luminate";
  label: string;
  adjustments: ImageAdjustments;
};

type CropModalProps = {
  open: boolean;
  imageSrc: string | null;
  crop: { x: number; y: number };
  zoom: number;
  rotation: number;
  adjustments: ImageAdjustments;
  onCropChange: (crop: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
  onRotationChange: (rotation: number) => void;
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
  adjustments,
  onCropChange,
  onZoomChange,
  onRotationChange,
  onAdjustmentChange,
  onResetAdjustments,
  onCropComplete,
  onClose,
  onSave,
  isSaving,
}: CropModalProps) {
  if (!open || !imageSrc) return null;

  const filterPresets: FilterPreset[] = [
    {
      id: "original",
      label: "Original",
      adjustments: { brightness: 100, contrast: 100, saturation: 100 },
    },
    {
      id: "studio",
      label: "Studio",
      adjustments: { brightness: 106, contrast: 112, saturation: 116 },
    },
    {
      id: "spotlight",
      label: "Spotlight",
      adjustments: { brightness: 112, contrast: 118, saturation: 128 },
    },
    {
      id: "prime",
      label: "Prime",
      adjustments: { brightness: 98, contrast: 110, saturation: 92 },
    },
    {
      id: "classic",
      label: "Classic",
      adjustments: { brightness: 102, contrast: 106, saturation: 110 },
    },
    {
      id: "edge",
      label: "Edge",
      adjustments: { brightness: 96, contrast: 124, saturation: 122 },
    },
    {
      id: "luminate",
      label: "Luminate",
      adjustments: { brightness: 114, contrast: 102, saturation: 108 },
    },
  ];

  const [cropViewportSize, setCropViewportSize] = React.useState(420);
  const wheelZoomSpeed = 0.2;
  const [minZoomLevel, setMinZoomLevel] = React.useState(1);

  React.useEffect(() => {
    const updateViewportSize = () => {
      const isMobile = window.innerWidth < 640;
      const maxByWidth = isMobile ? window.innerWidth - 40 : window.innerWidth - 56;
      const maxByHeight = isMobile ? window.innerHeight * 0.45 - 24 : 420;
      const nextSize = Math.round(Math.max(220, Math.min(420, maxByWidth, maxByHeight)));
      setCropViewportSize(nextSize);
    };

    updateViewportSize();
    window.addEventListener("resize", updateViewportSize);

    return () => {
      window.removeEventListener("resize", updateViewportSize);
    };
  }, []);

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
    [cropViewportSize, onZoomChange, zoom]
  );

  const activePresetId = React.useMemo(() => {
    const matchedPreset = filterPresets.find(
      (preset) =>
        preset.adjustments.brightness === adjustments.brightness &&
        preset.adjustments.contrast === adjustments.contrast &&
        preset.adjustments.saturation === adjustments.saturation
    );

    return matchedPreset?.id;
  }, [adjustments, filterPresets]);

  const applyPreset = (presetId: FilterPreset["id"]) => {
    if (presetId === "original") {
      onResetAdjustments();
      return;
    }

    const preset = filterPresets.find((item) => item.id === presetId);
    if (!preset) return;

    onAdjustmentChange("brightness", preset.adjustments.brightness);
    onAdjustmentChange("contrast", preset.adjustments.contrast);
    onAdjustmentChange("saturation", preset.adjustments.saturation);
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="dark w-[100vw] max-w-[100vw] h-[100dvh] rounded-none sm:w-[92vw] sm:max-w-5xl sm:h-[80vh] sm:rounded-lg grid-rows-[auto_minmax(0,1fr)_auto] p-0 gap-0 overflow-hidden border-border bg-background text-foreground"
      >
        <DialogHeader className="border-b px-4 py-4 sm:px-6">
          <DialogTitle>Edit photo</DialogTitle>
        </DialogHeader>

        <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,45vh)_minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_320px] lg:grid-rows-1">
          <div className="relative h-full bg-muted/20">
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
                cropSize={{ width: cropViewportSize, height: cropViewportSize }}
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

          <div className="border-t bg-muted/20 p-4 overflow-y-auto lg:border-t-0 lg:border-l lg:p-5">
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

              </TabsContent>

              <TabsContent value="filter" className="mt-5">
                <div className="grid grid-cols-3 gap-3">
                  {filterPresets.map((preset) => {
                    const presetFilterStyle = `brightness(${preset.adjustments.brightness}%) contrast(${preset.adjustments.contrast}%) saturate(${preset.adjustments.saturation}%)`;
                    const isActive = activePresetId === preset.id;

                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => applyPreset(preset.id)}
                        className="flex flex-col items-center gap-1 text-xs"
                        aria-label={`Apply ${preset.label} preset`}
                      >
                        <span
                          className={`relative h-16 w-16 overflow-hidden rounded-full border-2 ${isActive ? "border-primary" : "border-border"}`}
                        >
                          <span
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                              backgroundImage: `url(${imageSrc})`,
                              filter: presetFilterStyle,
                            }}
                          />
                        </span>
                        <span
                          className={
                            isActive
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }
                        >
                          {preset.label}
                        </span>
                      </button>
                    );
                  })}
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

        <div className="flex justify-end gap-3 border-t px-4 py-4 sm:px-6">
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