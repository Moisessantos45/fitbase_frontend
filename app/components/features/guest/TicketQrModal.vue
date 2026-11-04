<template>
	<MoleculesBaseModal
		:hidden="showTicketModal"
		title="Pase Digital de Acceso"
		width="520px"
		:hide-footer="true"
		@cancel="daypassStore.closeTicket"
	>
		<div v-if="currentTicket" class="space-y-5 text-center">
			<div class="p-5 rounded-2xl bg-[#0c0d0e] border-2 border-primary/40 shadow-2xl relative overflow-hidden">
				<div class="absolute -top-16 -right-16 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>

				<div class="flex items-center justify-between pb-3 border-b border-surface-light mb-4">
					<span class="text-[10px] font-black uppercase text-primary tracking-wider flex items-center gap-1">
						<Sparkles class="w-3 h-3" /> FITBASE PASS
					</span>
					<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
						1 ACCESO ÚNICO
					</span>
				</div>

				<h3 class="text-lg font-bold text-white">{{ currentTicket.gymName }}</h3>
				<p class="text-xs text-text-sub mt-0.5">{{ currentTicket.planName }}</p>

				<div class="mt-2 text-xs font-medium text-text-muted">
					Titular: <span class="text-white font-semibold">{{ currentTicket.fullName }}</span>
				</div>
				<div class="text-xs font-medium text-text-muted">
					Fecha de visita: <span class="text-primary font-bold">{{ currentTicket.visitDate }}</span>
				</div>

				<div class="my-5 flex flex-col items-center">
					<div class="p-3 bg-white rounded-2xl shadow-xl inline-block">
						<img
							:src="`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(currentTicket.slug)}`"
							:alt="`QR ${currentTicket.slug}`"
							class="w-56 h-56 object-contain block"
						/>
					</div>
				</div>

				<div class="bg-surface border border-surface-light rounded-xl p-3 flex items-center justify-between gap-2 max-w-sm mx-auto">
					<div class="text-left min-w-0">
						<span class="text-[9px] uppercase font-bold text-text-muted block">Código de Acceso</span>
						<p class="text-xs font-mono font-bold text-primary truncate">{{ currentTicket.slug }}</p>
					</div>
					<button
						type="button"
						@click="copySlug(currentTicket.slug)"
						class="p-2 rounded-lg bg-surface-light hover:bg-surface-hover text-text-sub hover:text-white transition cursor-pointer shrink-0"
						:title="copiedSlug ? '¡Copiado!' : 'Copiar código'"
					>
						<Check v-if="copiedSlug" class="w-3.5 h-3.5 text-success" />
						<Copy v-else class="w-3.5 h-3.5" />
					</button>
				</div>

				<div class="mt-4 p-3 rounded-xl bg-surface-light/30 border border-surface-light text-[11px] text-text-sub text-left space-y-1">
					<p class="font-semibold text-white flex items-center gap-1.5">
						<Download class="w-3.5 h-3.5 text-primary" /> Descarga tu pase para uso sin conexión
					</p>
					<p class="text-[10px] leading-relaxed">
						Presenta esta imagen descargada directamente en el lector óptico del torniquete o mostrador. No requerirás señal de internet en las instalaciones.
					</p>
				</div>
			</div>

			<div class="flex flex-col sm:flex-row items-center gap-2 pt-1">
				<button
					type="button"
					@click="downloadTicket"
					:disabled="downloading"
					class="btn-primary h-11! text-xs! font-bold w-full flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
				>
					<div v-if="downloading" class="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
					<Download v-else class="w-4 h-4" />
					Descargar Imagen QR (Offline)
				</button>
				<button
					type="button"
					@click="daypassStore.closeTicket"
					class="btn-secondary h-11! text-xs! font-semibold w-full sm:w-auto! px-6! cursor-pointer"
				>
					Cerrar
				</button>
			</div>
		</div>
	</MoleculesBaseModal>
</template>

<script setup lang="ts">
import { Check, Copy, Download, Sparkles } from "lucide-vue-next";

const daypassStore = useDayPassStore();
const { currentTicket, showTicketModal } = storeToRefs(daypassStore);
const { downloadCredentialCard, downloading } = useCredentialDownload();

const copiedSlug = ref(false);

const copySlug = (slug: string) => {
	if (typeof navigator !== "undefined" && navigator.clipboard) {
		navigator.clipboard.writeText(slug);
		copiedSlug.value = true;
		setTimeout(() => {
			copiedSlug.value = false;
		}, 2000);
	}
};

const downloadTicket = async () => {
	if (!currentTicket.value) return;
	await downloadCredentialCard({
		gymName: currentTicket.value.gymName,
		planName: currentTicket.value.planName,
		slug: currentTicket.value.slug,
		memberName: currentTicket.value.fullName,
		endDate: currentTicket.value.visitDate,
	});
};
</script>
