<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="q-mb-xl">
      <EditProfilePage v-if="status === 0" v-bind="props"/>
      <MotivationPage v-if="status === 1" v-bind="props"/>
      <EditEngagementPage v-if="status === 2" v-bind="props"/>
      <q-page v-if="status === 3" class="flex flex-center">
        <div>
          <div class="q-py-md text-h4">Du hast dich erfolgreich für das SOLA {{ $settings.currentYear }} angemeldet 🎉</div>
          <div class="q-pb-md text-body1">
            Damit ist dein Teil fürs erste getan. <br />
            Sobald du freigeschalten wirst, meldet sich jemand aus dem Leitungsteam bei dir.
          </div>
        </div>
      </q-page>
    </q-page-container>
    <q-footer class="transparent">
      <div class="text-h1">
        <div class="fixed-bottom q-py-none">
          <q-linear-progress size="25px" :value="progress" color="primary">
            <div class="flex justify-around">
              <q-icon
                name="fa-solid fa-user"
                :color="status >= $constants.userYearStatus.finishedProfile ? 'white' : 'grey'"
              />
              <q-icon
                name="fa-solid fa-file"
                :color="status >= $constants.userYearStatus.finishedMotivation ? 'white' : 'grey'"
              />
              <q-icon
                name="fa-solid fa-campground"
                :color="status >= $constants.userYearStatus.pending ? 'white' : 'grey'"
              />
            </div>
          </q-linear-progress>
        </div>
      </div>
      -
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, ref, getCurrentInstance } from 'vue'
import { useQuasar } from 'quasar'
import iconSet from 'quasar/icon-set/fontawesome-v6'
import EditProfilePage from 'src/pages/EditProfilePage.vue'
import MotivationPage from 'src/pages/MotivationPage.vue'
import EditEngagementPage from 'src/pages/EditEngagementPage.vue'

export default defineComponent({
    name: "NotLoggedIn",
    setup() {
        const $q = useQuasar();
        const { proxy } = getCurrentInstance();
        $q.iconSet = iconSet;
        $q.dark.set("auto");
        const c = proxy.$constants;
        const settings = proxy.$settings;
        const api = proxy.$api;
        const uuid = proxy.$keycloak.tokenParsed.sub;
        const progress = ref(0);
        const status = ref(null);
        const props = {
          registrationFlow: true
        }
        getStatus()
        function getStatus() {
          api.get("/userYear/" + uuid + "/" + settings.currentYear).then(function (response) {
            switch (response.data.status) {
                case c.userYearStatus.notRegistered:
                    progress.value = 0.166666
                    status.value = 0
                  break;
                case c.userYearStatus.finishedProfile:
                    progress.value = 0.5
                    status.value = 1
                  break;
                case c.userYearStatus.finishedMotivation:
                    progress.value = 0.833333;
                    status.value = 2
                  break;
                case c.userYearStatus.pending:
                    progress.value = 1;
                    status.value = 3
                  break;
                case c.userYearStatus.activated:
                    location.href='/l/'
                  break;
                case c.userYearStatus.rejected:
                    location.href='/'
                  break;
                default:
                  status.value = 0
                  break;
            }
        }).catch(function (e) {
          if (e.response.status === c.userYearStatus.notFound) {
                    progress.value = 0.166666
                    status.value = 0
          }
        });
      }
        return {
            progress,
            status,
            props
        };
    },
    components: { EditProfilePage, MotivationPage, EditEngagementPage }
})
</script>
