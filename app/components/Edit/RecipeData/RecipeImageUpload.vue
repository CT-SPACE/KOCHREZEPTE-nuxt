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
            title="Rezeptbild auswählen" aria-label="Clear Image" @update:model-value="setFile">
            <template v-if="selectedFile" #default>
                <!-- <VFileUploadList aria-label="Bild entfernen" title="Bild entfernen" clearable /> -->
                <VFileUploadList clearable>
                    <template #item="{ file, props }">
                        <VFileUploadItem :file="file" v-bind="props" clearable>
                            <template #clear>
                                <v-btn type="button" icon="$clear" variant="text" density="comfortable"
                                    aria-label="Bildauswahl entfernen" title="Bildauswahl entfernen"
                                    @click.stop="confirmRemove = true" />
                            </template>
                        </VFileUploadItem>
                    </template>
                </VFileUploadList>
            </template>
        </v-file-upload>

        <ClientOnly>
            <div v-if="previewUrl">
                <p>Zu speicherndes Bild:</p>
            </div>
            <div v-if="imageUrl" class="crop-actions">
                <v-btn v-if="!previewUrl" type="button" @click="approve">
                    Approve
                </v-btn>
                <v-btn v-else type="button" @click="editCrop">
                    Ausschnitt bearbeiten
                </v-btn>
            </div>
            <div v-if="previewUrl">

                <img :src="previewUrl" alt="Vorschau des gewählten Bildausschnitts" class="preview">
            </div>


            <Cropper v-if="imageUrl" v-show="!previewUrl" ref="cropper" class="cropper" :src="imageUrl"
                :stencil-props="{ aspectRatio: 5 / 1 }" :canvas="true" />

            <v-alert v-if="error" type="error" class="mt-3">
                {{ error }}
            </v-alert>
        </ClientOnly>

        <v-dialog v-model="confirmRemove" max-width="400" aria-labelledby="remove-image-title">
            <v-card>
                <v-card-title id="remove-image-title">Bild entfernen?</v-card-title>
                <v-card-text>
                    Das Bild wird gelöscht.
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn type="button" @click="confirmRemove = false">Nein</v-btn>
                    <v-btn type="button" color="error" @click="selectedFile = null; confirmRemove = false">
                        Ja, entfernen
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>


<script setup lang="ts">
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { VFileUploadList, VFileUploadItem } from 'vuetify/labs/VFileUpload'

const selectedFile = defineModel<File | null>({ required: true })
const approvedCrop = defineModel<HTMLCanvasElement | null>('approvedCrop', {
    required: true,
})
const cropper = ref<InstanceType<typeof Cropper> | null>(null)
const imageUrl = ref<string | null>(null)
const previewUrl = ref<string | null>(null)
const error = ref('')
const confirmRemove = ref(false)

watch(selectedFile, (file, _previous, onCleanup) => {
    previewUrl.value = null
    approvedCrop.value = null
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
        approvedCrop.value = canvas
    } catch (err) {
        console.error('Bildvorschau konnte nicht erstellt werden:', err)
        error.value = 'Die Bildvorschau konnte nicht erstellt werden.'
    }
}

function editCrop() {
    approvedCrop.value = null
    previewUrl.value = null
    error.value = ''
}
</script>

<style scoped>
.cropper {
    height: 300px;
    background: #222;

}

.crop-actions {
    display: flex;
    justify-content: flex-end;
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

.displayNone {
    display: none;
}
</style>
