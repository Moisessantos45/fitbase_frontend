export const useCredentialDownload = () => {
	const downloading = ref(false);

	const downloadCredentialCard = async (options: {
		gymName: string;
		planName: string;
		slug: string;
		endDate?: string;
		memberName?: string;
	}) => {
		if (!options.slug) return;
		downloading.value = true;

		try {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			if (!ctx) throw new Error("Canvas context not available");

			const width = 640;
			const height = 900;
			canvas.width = width;
			canvas.height = height;

			ctx.fillStyle = "#0c0d0e";
			ctx.fillRect(0, 0, width, height);

			ctx.strokeStyle = "#ccff00";
			ctx.lineWidth = 4;
			ctx.strokeRect(16, 16, width - 32, height - 32);

			const headerGrad = ctx.createLinearGradient(0, 16, 0, 130);
			headerGrad.addColorStop(0, "rgba(204, 255, 0, 0.15)");
			headerGrad.addColorStop(1, "rgba(204, 255, 0, 0)");
			ctx.fillStyle = headerGrad;
			ctx.fillRect(16, 16, width - 32, 120);

			ctx.fillStyle = "#ccff00";
			ctx.font = "bold 14px sans-serif";
			ctx.textAlign = "center";
			ctx.fillText("FITBASE • PASE DIGITAL DE ACCESO", width / 2, 60);

			ctx.fillStyle = "#ffffff";
			ctx.font = "bold 24px sans-serif";
			ctx.fillText(options.gymName || "Fitbase Gym", width / 2, 95);

			ctx.fillStyle = "#9ca3af";
			ctx.font = "14px sans-serif";
			ctx.fillText(options.planName || "Membresía", width / 2, 125);

			if (options.memberName) {
				ctx.fillStyle = "#e5e7eb";
				ctx.font = "600 15px sans-serif";
				ctx.fillText(`Socio: ${options.memberName}`, width / 2, 155);
			}

			const qrSize = 340;
			const qrX = (width - qrSize) / 2;
			const qrY = 190;

			ctx.fillStyle = "#ffffff";
			ctx.beginPath();
			ctx.roundRect(qrX - 16, qrY - 16, qrSize + 32, qrSize + 32, 24);
			ctx.fill();

			const qrImg = new Image();
			qrImg.crossOrigin = "anonymous";
			qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=340x340&data=${encodeURIComponent(options.slug)}`;

			await new Promise<void>((resolve, reject) => {
				qrImg.onload = () => resolve();
				qrImg.onerror = () => reject(new Error("QR load error"));
			});

			ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

			const codeBoxY = qrY + qrSize + 35;
			ctx.fillStyle = "#181a1d";
			ctx.beginPath();
			ctx.roundRect(48, codeBoxY, width - 96, 75, 16);
			ctx.fill();
			ctx.strokeStyle = "#272a30";
			ctx.lineWidth = 1.5;
			ctx.stroke();

			ctx.fillStyle = "#9ca3af";
			ctx.font = "11px sans-serif";
			ctx.fillText("CÓDIGO DE ACCESO (SLUG)", width / 2, codeBoxY + 26);

			ctx.fillStyle = "#ccff00";
			ctx.font = "bold 13px monospace";
			ctx.fillText(options.slug, width / 2, codeBoxY + 52);

			if (options.endDate) {
				ctx.fillStyle = "#ffffff";
				ctx.font = "bold 13px sans-serif";
				ctx.fillText(
					`Válido hasta: ${options.endDate}`,
					width / 2,
					codeBoxY + 115,
				);
			}

			ctx.fillStyle = "#6b7280";
			ctx.font = "11px sans-serif";
			ctx.fillText(
				"Presenta esta imagen en el lector óptico del torniquete",
				width / 2,
				codeBoxY + 145,
			);

			const dataUrl = canvas.toDataURL("image/png");
			const cleanName = (options.gymName || "fitbase")
				.toLowerCase()
				.replace(/[^a-z0-9]/g, "-");
			const a = document.createElement("a");
			a.href = dataUrl;
			a.download = `credencial-${cleanName}-${options.slug.slice(0, 8)}.png`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		} catch (_) {
			const fallbackRes = await fetch(
				`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(options.slug)}`,
			);
			const blob = await fallbackRes.blob();
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `credencial-qr-${options.slug.slice(0, 8)}.png`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} finally {
			downloading.value = false;
		}
	};

	return {
		downloading,
		downloadCredentialCard,
	};
};
