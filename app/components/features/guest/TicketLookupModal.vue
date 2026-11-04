<template>
	<MoleculesBaseModal
		:hidden="showLookupModal"
		title="Consultar Boleto o Pase QR"
		width="480px"
		:hide-footer="true"
		@cancel="daypassStore.closeLookup"
	>
		<form @submit.prevent="lookupTicket" class="space-y-4">
			<p class="text-xs text-text-sub">
				Ingresa el código identificador (Slug) de tu pase de un solo uso para visualizar tu código QR y descargarlo a tu dispositivo.
			</p>
			<div class="space-y-1.5">
				<label class="text-xs font-bold text-white block">Código de Ticket (UUID / Slug):</label>
				<input
					type="text"
					v-model="slugInput"
					placeholder="0192663b-6f81-7994-b25c-05ec2c6c3981"
					class="input-field h-11! py-2! text-xs font-mono w-full"
					required
				/>
			</div>

			<div v-if="localError || lastError" class="p-3 rounded-xl bg-error/10 border border-error/20 text-error text-xs flex items-center gap-2">
				<AlertCircle class="w-4 h-4 shrink-0" />
				<span>{{ localError || lastError }}</span>
			</div>

			<div class="pt-2 flex items-center justify-end gap-2.5">
				<button
					type="button"
					@click="daypassStore.closeLookup"
					class="btn-secondary h-10! text-xs! px-4! cursor-pointer"
				>
					Cancelar
				</button>
				<button
					type="submit"
					:disabled="loading || !slugInput.trim()"
					class="btn-primary h-10! text-xs! px-5! font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
				>
					<div v-if="loading" class="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
					<Search v-else class="w-3.5 h-3.5" />
					Consultar
				</button>
			</div>
		</form>
	</MoleculesBaseModal>
</template>

<script setup lang="ts">
import { AlertCircle, Search } from "lucide-vue-next";

const daypassStore = useDayPassStore();
const { showLookupModal, currentTicket, loading, lastError } =
	storeToRefs(daypassStore);

const slugInput = ref("");
const localError = ref<string | null>(null);

const lookupTicket = async () => {
	localError.value = null;
	const slug = slugInput.value.trim();
	if (!slug) return;

	await daypassStore.getTicketBySlug(slug);
	if (currentTicket.value) {
		daypassStore.closeLookup();
		slugInput.value = "";
		daypassStore.openTicket();
	} else {
		localError.value = "No se encontró ningún pase con ese código.";
	}
};
</script>
