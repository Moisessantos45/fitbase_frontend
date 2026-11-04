<template>
  <MoleculesBaseModal
    :hidden="show"
    title="Guía de Formato Markdown"
    :hide-footer="true"
    width="550px"
    @cancel="$emit('close')"
  >
    <div class="flex flex-col gap-4 text-left">
      <p class="text-sm text-text-sub">
        Puedes usar Markdown para dar formato al texto de tus descripciones,
        notas y comentarios. Aquí tienes los formatos más comunes soportados:
      </p>

      <div class="overflow-x-auto rounded-xl border border-surface-light">
        <table class="w-full text-xs border-collapse">
          <thead>
            <tr class="bg-card border-b border-surface-light">
              <th class="p-2.5 font-bold text-white w-[45%] text-left">
                Formato a escribir
              </th>
              <th class="p-2.5 font-bold text-white text-left">
                Resultado visual
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-surface-light">
              <td class="p-2.5 font-mono text-text-sub"># Título Grande</td>
              <td class="p-2.5 text-base font-bold text-white">
                Título Grande
              </td>
            </tr>
            <tr class="border-b border-surface-light">
              <td class="p-2.5 font-mono text-text-sub">## Título Mediano</td>
              <td class="p-2.5 text-sm font-bold text-white">Título Mediano</td>
            </tr>
            <tr class="border-b border-surface-light">
              <td class="p-2.5 font-mono text-text-sub">
                **texto en negrita**
              </td>
              <td class="p-2.5 font-bold text-white">texto en negrita</td>
            </tr>
            <tr class="border-b border-surface-light">
              <td class="p-2.5 font-mono text-text-sub">*texto en cursiva*</td>
              <td class="p-2.5 italic text-text-sub">texto en cursiva</td>
            </tr>
            <tr class="border-b border-surface-light">
              <td class="p-2.5 font-mono text-text-sub">- Elemento de lista</td>
              <td class="p-2.5 text-text-sub">
                <ul class="list-disc pl-4">
                  <li>Elemento de lista</li>
                </ul>
              </td>
            </tr>
            <tr class="border-b border-surface-light">
              <td class="p-2.5 font-mono text-text-sub">
                1. Elemento ordenado
              </td>
              <td class="p-2.5 text-text-sub">
                <ol class="list-decimal pl-4">
                  <li>Elemento ordenado</li>
                </ol>
              </td>
            </tr>
            <tr class="border-b border-surface-light">
              <td class="p-2.5 font-mono text-text-sub">
                [Enlace](https://...)
              </td>
              <td class="p-2.5 text-primary underline">Enlace</td>
            </tr>
            <tr class="border-b border-surface-light">
              <td class="p-2.5 font-mono text-text-sub">`código en línea`</td>
              <td class="p-2.5">
                <code
                  class="bg-surface-light px-1.5 py-0.5 rounded-md text-xs text-error font-mono"
                  >código en línea</code
                >
              </td>
            </tr>
            <tr class="border-b border-surface-light">
              <td class="p-2.5 font-mono text-text-sub">&gt; Texto citado</td>
              <td
                class="p-2.5 border-l-2 border-primary pl-2 italic text-text-muted"
              >
                Texto citado
              </td>
            </tr>
            <tr>
              <td class="p-2.5 font-mono text-text-sub whitespace-pre-wrap">
                ```js const x = 10; ```
              </td>
              <td class="p-2.5">
                <pre
                  class="bg-surface-light p-2 rounded-lg text-[10px] border border-surface-light font-mono text-white"
                >
const x = 10;</pre
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex justify-end mt-2">
        <button
          type="button"
          @click="$emit('close')"
          class="px-5 py-2.5 text-xs font-bold text-on-primary bg-primary hover:bg-primary-dark rounded-xl transition-all cursor-pointer outline-none border-none"
        >
          Entendido
        </button>
      </div>
    </div>
  </MoleculesBaseModal>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
}>();

defineEmits(["close"]);
</script>
