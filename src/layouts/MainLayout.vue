<template>
  <ChangelogDialog
    v-model="showChangelog"
  />
  <q-layout :v-if="showLayout" view="lHh Lpr lFf">
    <q-header bordered>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="fa-solid fa-bars"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          LAMA - Lippesola Administration und Mitarbeiter Anmeldung
        </q-toolbar-title>

        <q-btn
          class="q-mr-md"
          flat
          dense
          round
          icon="fa-solid fa-grip"
        >
          <q-menu>
            <q-list style="max-width: 300px; display: flex;">
              <q-item style="flex: 1" clickable href="https://a-z.lippesola.de" v-close-popup>
                <q-item-section class="flex flex-center">
                  <q-item-label>
                    <q-avatar icon="fa-solid fa-book-atlas" />
                  </q-item-label>
                  <q-item-label>A-Z</q-item-label>
                </q-item-section>
              </q-item>
              <q-item style="flex: 1" clickable href="https://cloud.lippesola.de" v-close-popup>
                <q-item-section class="flex flex-center">
                  <q-item-label>
                    <q-avatar icon="fa-solid fa-cloud" />
                  </q-item-label>
                  <q-item-label>Cloud</q-item-label>
                </q-item-section>
              </q-item>
              <q-item style="flex: 1" clickable href="https://chat.lippesola.de" v-close-popup>
                <q-item-section class="flex flex-center">
                  <q-item-label>
                    <q-avatar icon="fa-solid fa-envelope" />
                  </q-item-label>
                  <q-item-label>Messenger</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <q-btn
          flat
          dense
          round
        >
          <q-avatar v-if="!avatar" color="secondary" text-color="white" icon="fa-solid fa-user">
          </q-avatar>
          <q-avatar v-if="avatar" color="primary" text-color="white">
            <img :src="avatar" />
          </q-avatar>
          <q-menu>
            <q-list style="min-width: 150px">
              <q-item clickable to="/l/profile" v-close-popup>
                <q-item-section>Persönliche Daten</q-item-section>
              </q-item>
              <q-item clickable to="/l/avatar" v-close-popup>
                <q-item-section>Profilbild</q-item-section>
              </q-item>
              <q-item clickable @click="toggleDarkMode">
                <q-item-section>{{ $q.dark.isActive ? 'Light-Mode' : 'Dark-Mode' }}</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup :href="$keycloakLogout" >
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          MA-Bereich
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
        <q-separator inset spaced="xl" />
        <div v-if="$keycloak.tokenParsed.groups.includes($settings.currentYear + '_LT')">
          <q-item-label
            header
          >
            LT-Bereich
          </q-item-label>
          <EssentialLink
            v-for="link in leaderLinks"
            :key="link.title"
            v-bind="link"
          />
        </div>  
      </q-list>
      <div class="fixed-bottom" @click="showChangelog = true">
        <q-btn
          :label="$version"
          no-caps
          flat 
          text-color="grey"
        />
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, getCurrentInstance, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import ChangelogDialog from 'components/ChangelogDialog.vue'
import { settings } from '../boot/settings'
import { useQuasar } from 'quasar'
import iconSet from 'quasar/icon-set/fontawesome-v6'
import { api } from 'src/boot/axios'
import VueKeycloak from '@dsb-norge/vue-keycloak-js'
const linksList = [
  {
    title: 'Home',
    icon: 'fa-solid fa-house-chimney',
    link: '/l/'
  },
  {
    title: 'Dein Profil',
    icon: 'fa-solid fa-user',
    link: '/l/profile'
  },
  {
    title: 'Dein SOLA ' + settings.currentYear,
    icon: 'fa-solid fa-campground',
    link: '/l/engagement'
  },
  {
    title: 'MA-Liste',
    icon: 'fa-solid fa-users',
    link: '/l/userlist'
  },
  {
    title: 'Papierkram',
    icon: 'fa-solid fa-file-lines',
    link: '/l/paperwork',
    badge: 'paperwork',
  },
  {
    title: 'Mail-Verteiler',
    icon: 'fa-solid fa-envelope',
    link: '/l/mail',
  }
];
const leaderLinksList = [
  {
    title: 'MA-Verwaltung',
    icon: 'fa-solid fa-user-gear',
    link: '/l/leader/activation'
  },
  {
    title: 'MA-Listen',
    icon: 'fa-solid fa-list-ul',
    link: '/l/leader/userlist'
  },
  {
    title: 'Helfer-Übersicht',
    icon: 'fa-solid fa-user-clock',
    link: '/l/leader/supporterlist'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
    ChangelogDialog
  },

  setup () {
    const $q = useQuasar()
    const { proxy } = getCurrentInstance()
    const uuid = proxy.$keycloak.tokenParsed.sub
    const c = proxy.$constants
    const showLayout = ref(false)
    const showChangelog = ref(false)

    switch (proxy.$status) {
      case c.userYearStatus.activated:
        showLayout.value = true
        break;
      case c.userYearStatus.pending:
        location.href="/w"
        break;
      case c.userYearStatus.notRegistered:
      case c.userYearStatus.finishedProfile:
      case c.userYearStatus.finishedMotivation:
      case c.userYearStatus.notFound:
          location.href="/r"
          break;
      default:
        break;
    }

    const leftDrawerOpen = ref(false)
    const avatar = ref('');


    if (window.localStorage.getItem('darkmode') === null) {
      $q.dark.set('auto')
    } else {
      $q.dark.set(window.localStorage.getItem('darkmode') === 'true')
    }

    // changed icons
    $q.iconSet = iconSet

    api.get('/avatar/' + uuid, {
      responseType: 'blob'
    }).then(function(response) {
      avatar.value = URL.createObjectURL(response.data, 'binary').toString('base64')
    }).catch(function(e){

    })

    return {
      essentialLinks: linksList,
      leaderLinks: leaderLinksList,
      leftDrawerOpen,
      avatar,
      showLayout,
      showChangelog,
      toggleDarkMode () {
        $q.dark.toggle()
        window.localStorage.setItem('darkmode', $q.dark.isActive);
      },
      logout () {
        VueKeycloak.logout()
      },
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  },
})
</script>
