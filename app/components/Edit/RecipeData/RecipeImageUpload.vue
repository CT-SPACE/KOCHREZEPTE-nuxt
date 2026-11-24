<!-- <template>

    <v-container>
        <v-file-upload :model-value="selectedFile ?? undefined" accept="image/jpeg,image/png,image/webp" clearable
            title="Rezeptbild auswählen" @update:model-value="setFile" />
    </v-container>
    <ClientOnly>
        <Cropper v-if="imageUrl" class="cropper" :src="imageUrl" :stencil-props="{ aspectRatio: 5 / 1 }"
            :canvas="false" />
    </ClientOnly>
</template> -->
<template>
    <v-container>
        <v-file-upload :model-value="selectedFile ?? undefined" accept="image/jpeg,image/png,image/webp" clearable
            title="Rezeptbild auswählen" @update:model-value="setFile">
            <template v-if="selectedFile" #default>
                <VFileUploadList clearable />
            </template>
        </v-file-upload>
        <ClientOnly class="positionR"> <v-btn v-if="imageUrl && !previewUrl" type="button" class="mt-3 btn-position"
                @click="approve">
                Approve
            </v-btn>

            <div v-if="previewUrl" class="mt-3 ">
                <p>Zuspeicherndes Bild:</p>
                <img :src="previewUrl" alt="Vorschau des gewählten Bildausschnitts" class="preview">
                <v-btn type="button" class="mt-3 btn-position" @click="editCrop">
                    Ausschnitt bearbeiten
                </v-btn>
            </div>
            <Cropper v-if="imageUrl" v-show="!previewUrl" ref="cropper" class="cropper" :src="imageUrl"
                :stencil-props="{ aspectRatio: 5 / 1 }" :canvas="true" />

            <v-alert v-if="error" type="error" class="mt-3">
                {{ error }}
            </v-alert>
        </ClientOnly>
    </v-container>
</template>


<script setup lang="ts">
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { VFileUploadList } from 'vuetify/labs/VFileUpload'

const selectedFile = defineModel<File | null>({ required: true })
const cropper = ref<InstanceType<typeof Cropper> | null>(null)
const imageUrl = ref<string | null>(null)
const previewUrl = ref<string | null>(null)
const error = ref('')


watch(selectedFile, (file, _previous, onCleanup) => {
    previewUrl.value = null
    error.value = ''
    if (!file) {
        imageUrl.value = null
        return
    }

    const url = URL.createObjectURL(file)
    imageUrl.value = url
    onCleanup(() => URL.revokeObjectURL(url))
}, { immediate: true })


function setFile(file: File | File[] | null | undefined) {
    selectedFile.value = Array.isArray(file) ? file[0] ?? null : file ?? null
}


function approve() {
    error.value = ''

    try {
        const canvas = cropper.value?.getResult().canvas

        if (!canvas || !canvas.width || !canvas.height) {
            error.value = 'Das Bild ist noch nicht bereit. Bitte erneut versuchen.'
            return
        }

        previewUrl.value = canvas.toDataURL('image/png')
    } catch (err) {
        console.error('Bildvorschau konnte nicht erstellt werden:', err)
        error.value = 'Die Bildvorschau konnte nicht erstellt werden.'
    }
}

function editCrop() {
    previewUrl.value = null
    error.value = ''
}
</script>

<style scoped>
.cropper {
    height: 300px;
    background: #222;

}

.positionR {
    position: relative;
}

.preview {
    display: block;
    border: 1px solid lightgray;
    border-radius: 6px;
    width: 100%;
    height: auto;
}

.cropBtnPosition {
    position: absolute;
}

.btn-position {
    position: absolute;
    z-index: 10;
}

.displayNone {
    display: none;
}
</style>
