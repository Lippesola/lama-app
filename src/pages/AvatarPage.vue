<template>

  <div class="q-pa-md text-h4">Dein Profil</div>
  <div class="q-pa-md">
    <div class="q-py-md text-h5">Profilbild hochladen</div>
    <q-file
      v-model="avatarImg"
      outlined
      label="Dateien durchsuchen..."
      @update:model-value="handleUploadAvatar()"
      accept="image/*"
    />
    <cropper
      class="cropper"
      autoZoom
      :src="croppedAvatarImg"
      :stencil-props="{
        aspectRatio: 1/1
      }"
      @change="cropImage"
    />
    <div class="q-py-md">
      <q-btn label="Profilbild hochladen" color="primary" @click="submitUploadAvatar"/>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from 'vue'
import { api } from '../boot/axios'
import { useQuasar } from 'quasar'
import { Cropper } from 'vue-advanced-cropper'
import FormData from 'form-data';
import 'vue-advanced-cropper/dist/style.css';
export default {
  name: 'AvatarPage',

  components: {
    Cropper
  },

  
  setup() {
    const $q = useQuasar()
    const { proxy } = getCurrentInstance()
    const uuid = proxy.$keycloak.tokenParsed.sub

    let avatarUrl = ''
    const croppedAvatarImg = ref('')
    const avatarImg = ref('')

    function cropImage({coordinates, canvas}) {
      avatarUrl = canvas.toDataURL("image/jpeg")
    }

    function submitUploadAvatar() {
      const formData = new FormData()
      const file = dataURLtoFile(avatarUrl, 'bla.jpeg')
      formData.append('image', file, file.name)
      api.post("/avatar/" + uuid, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then(function() {
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'fa-solid fa-check',
          message: 'Profilbild wurde aktualisiert'
        })
      })
      .catch(function() {
        $q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'fa-solid fa-circle-xmark ',
          message: 'Fehler'
        })
      })
    }

    function handleUploadAvatar() { 
      if (avatarImg.value) { 
        croppedAvatarImg.value = URL.createObjectURL(avatarImg.value);
      }
    }

    function dataURLtoFile(dataurl, filename) {
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n) {
        u8arr[n - 1] = bstr.charCodeAt(n - 1)
        n -= 1 // to make eslint happy
      }
      return new File([u8arr], filename, { type: mime })
    }
    return {
      avatarImg,
      croppedAvatarImg,
      handleUploadAvatar,
      submitUploadAvatar,
      cropImage,
    }
  }
  
}
</script>
