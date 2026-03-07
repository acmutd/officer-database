import { Pencil, Loader2, Camera as CameraIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { updateOfficerImageMutation } from "@/queries/officer";
import { toast } from "sonner";
import type { Photo } from "@/schemas/officer";
import { getOfficerImageUrl } from "@/lib/image";
import { CropModal, type ImageAdjustments } from "./cropModal";
import type { Area } from "react-easy-crop";
import { Camera as CameraComponent } from "./Camera";

type Props = {
	photo: Photo;
	officerId: string;
	firstName: string;
	lastName: string;
};



export function ImageUpdate({ photo, officerId, firstName, lastName }: Props) {
	const avatarOutputSize = 720;

	const defaultAdjustments: ImageAdjustments = {
		brightness: 100,
		contrast: 100,
		saturation: 100,
	};

	const [imageSrc, setImageSrc] = React.useState<string | null>(null);
	const [showCropper, setShowCropper] = React.useState(false);
	const [crop, setCrop] = React.useState({ x: 0, y: 0 });
	const [zoom, setZoom] = React.useState(1);
	const [rotation, setRotation] = React.useState(0);
	const [adjustments, setAdjustments] = React.useState<ImageAdjustments>(
		defaultAdjustments
	);
	const [area, setArea] = React.useState<Area | null>(null);

	const avatar = getOfficerImageUrl(photo);
	const { mutate: updateUserImage, isPending } = useMutation({
		...updateOfficerImageMutation,
		onSuccess: () => {
			toast.success("Image updated successfully", {
				action: {
					label: "Refresh",
					onClick: () => {
						window.location.reload();
					},
				},
			});
		},
		onError: () => {
			toast.error("Failed to update image");
		},
	});
	const fileInputRef = React.useRef<HTMLInputElement>(null);
	const [showCamera, setShowCamera] = React.useState(false);
	const [isMobile, setIsMobile] = useState(false);

	// Detects if A user is on mobile to determine whether to show the webcam preview (desktop) or open IOS/Android camera directly (mobile).
	useEffect(() => {
		const ua = navigator.userAgent || navigator.vendor || '';
		if (/android/i.test(ua) || /iPad|iPhone|iPod/.test(ua)) {
			setIsMobile(true);
		}
	}, []);

	const cleanupImageSource = React.useCallback((src: string | null) => {
		if (src?.startsWith("blob:")) {
			URL.revokeObjectURL(src);
		}
	}, []);

	const handleImageClick = () => {
		fileInputRef.current?.click();
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.size > 10 * 1024 * 1024) {
			toast.error("Image size must be less than 10MB");
			return;
		}
		const url = URL.createObjectURL(file);
		setImageSrc(url);
		setCrop({ x: 0, y: 0 });
		setZoom(1);
		setRotation(0);
		setAdjustments(defaultAdjustments);
		setShowCropper(true);
		e.target.value = "";
	};

	const handleAdjustmentChange = React.useCallback(
		(key: keyof ImageAdjustments, value: number) => {
			setAdjustments((prev) => ({ ...prev, [key]: value }));
		},
		[]
	);

	const resetAdjustments = React.useCallback(() => {
		setAdjustments(defaultAdjustments);
	}, []);

	function toRadians(degrees: number) {
		return (degrees * Math.PI) / 180;
	}

	function getRotatedSize(width: number, height: number, rotationInDegrees: number) {
		const rotationInRadians = toRadians(rotationInDegrees);
		return {
			width:
				Math.abs(Math.cos(rotationInRadians) * width) +
				Math.abs(Math.sin(rotationInRadians) * height),
			height:
				Math.abs(Math.sin(rotationInRadians) * width) +
				Math.abs(Math.cos(rotationInRadians) * height),
		};
	}

	async function cropImage(
		src: string,
		cropArea: { x: number; y: number; width: number; height: number }
	) {
		const image = new Image();
		image.src = src;

		await new Promise((resolve, reject) => {
			image.onload = resolve;
			image.onerror = reject;
		});

		const rotatedBounds = getRotatedSize(image.width, image.height, rotation);
		const previewCanvas = document.createElement("canvas");
		previewCanvas.width = rotatedBounds.width;
		previewCanvas.height = rotatedBounds.height;
		const previewContext = previewCanvas.getContext("2d");

		if (!previewContext) {
			return null;
		}

		previewContext.filter = `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%)`;
		previewContext.translate(rotatedBounds.width / 2, rotatedBounds.height / 2);
		previewContext.rotate(toRadians(rotation));
		previewContext.translate(-image.width / 2, -image.height / 2);
		previewContext.drawImage(image, 0, 0);
		previewContext.setTransform(1, 0, 0, 1, 0, 0);

		const outputCanvas = document.createElement("canvas");
		outputCanvas.width = avatarOutputSize;
		outputCanvas.height = avatarOutputSize;
		const outputContext = outputCanvas.getContext("2d");

		if (!outputContext) {
			return null;
		}

		outputContext.drawImage(
			previewCanvas,
			cropArea.x,
			cropArea.y,
			cropArea.width,
			cropArea.height,
			0,
			0,
			avatarOutputSize,
			avatarOutputSize
		);

		return new Promise<Blob | null>((resolve) => {
			outputCanvas.toBlob(
			(blob) => resolve(blob),
			"image/jpeg",
			0.9
			);
		});
	}

	const handleSaveCrop = async () => {

		if (!area || !imageSrc)
			return;

		try {

			const blob = await cropImage(imageSrc, area);
			if (!blob) {
				toast.error("Failed to process image");
				return;
}
			const file = new File([blob], "avatar.jpg", {
			type: "image/jpeg",
			});

			updateUserImage({ officerId, file });

			setShowCropper(false);
			cleanupImageSource(imageSrc);
			setImageSrc(null);

		} catch {
			toast.error("Failed to process image");
		}
		};

	const handleCapture = (imageSrc: string) => {
		setImageSrc(imageSrc);
		setCrop({ x: 0, y: 0 });
		setZoom(1);
		setRotation(0);
		setAdjustments(defaultAdjustments);
		setShowCropper(true);
		setShowCamera(false);
	};

	return (
		<>
			<CropModal
				open={showCropper}
				imageSrc={imageSrc}
				crop={crop}
				zoom={zoom}
				rotation={rotation}
				adjustments={adjustments}
				onCropChange={setCrop}
				onZoomChange={setZoom}
				onRotationChange={setRotation}
				onAdjustmentChange={handleAdjustmentChange}
				onResetAdjustments={resetAdjustments}
				onCropComplete={setArea}
				onClose={() => {
					cleanupImageSource(imageSrc);
					setShowCropper(false);
					setImageSrc(null);
				}}
				onSave={handleSaveCrop}
				isSaving={isPending}
			/>
			<div className="group relative flex flex-col items-center">
				<Avatar className="h-36 w-36 shadow-2xl">
					{photo.url && (
						<AvatarImage
							src={avatar}
							alt="Profile"
							className="rounded-full object-cover"
						/>
					)}
					<AvatarFallback className="bg-linear-to-br from-purple-500 to-blue-500 text-white text-2xl font-bold">
						{firstName[0] ?? ""}
						{lastName[0] ?? ""}
					</AvatarFallback>
				</Avatar>
				<input
					type="file"
					ref={fileInputRef}
					onChange={handleImageChange}
					accept="image/*"
					className="hidden"
					{...(isMobile ? { capture: "environment" } : {})}
				/>
				<div className="absolute -right-1 top-0 flex space-x-1">
					<Button
						size="icon"
						variant="secondary"
						className="absolute -right-1 top-27 cursor-pointer rounded-full shadow-xl transition-shadow duration-300 hover:shadow-purple-500/20"
						onClick={handleImageClick}
						disabled={isPending}
					>
						{isPending ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Pencil className="h-4 w-4" />
						)}
					</Button>
					<Button
						size="icon"
						variant="secondary"
						className="cursor-pointer rounded-full shadow-xl transition-shadow duration-300 hover:shadow-purple-500/20"
						onClick={() => {
		if (isMobile) {
			handleImageClick();
		} else {
			setShowCamera(true);
		}
	}}
						disabled={isPending}
					>
						<CameraIcon className="h-4 w-4" />
					</Button>
				</div>
			</div>
			<Dialog open={showCamera} onOpenChange={setShowCamera}>
				<DialogContent className="max-w-md border-white/10 bg-gradient-to-br from-white/5 to-white/10 text-white shadow-2xl backdrop-blur-xl sm:rounded-3xl">
					<DialogHeader className="items-center text-center">
						<DialogTitle>Take a Photo</DialogTitle>
					</DialogHeader>
					<CameraComponent onCapture={handleCapture} onClose={() => setShowCamera(false)} />
				</DialogContent>
			</Dialog>
		</>
	);
}
