<template>
  <div>
    <q-dialog v-model="showAddGroupDialog">
      <q-card>
        <q-card-section
          class="q-pa-md"
        >
          <div class="q-pa-xs">
            <q-input
              v-model="newGroup.groupNumber"
              label="Gruppennummer"
              outlined
              dense
              type="number"
            />
          </div>
          <div class="q-pa-xs">
            <q-input
              v-model="newGroup.title"
              label="Gruppenname"
              outlined
              dense
            />
          </div>
          <div class="q-pa-xs">
            <q-input
              v-model="newGroup.color"
              label="Farbe"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon class="fas fa-palette">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-color
                      v-model="newGroup.color"
                      no-header
                      no-footer
                      default-view="palette"
                      class="my-picker"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="q-pa-xs">
            <q-select
              v-model="newGroup.type"
              label="Typ"
              outlined
              dense
              :options="typeOptions"
              disable
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Abbrechen"
            @click="closeAddGroupDialog"
          />
          <q-btn
            flat
            label="Hinzufügen"
            @click="addGroup"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showWishDialog">
      <q-card
        :set="v = {p: wishDialogModel.participator, w: getWishes(wishDialogModel.participator)}"
      >
        <q-card-section>
          <div class="text-subtitle1">
            Wünsche von {{ wishDialogModel.participator.firstName }} {{ wishDialogModel.participator.lastName }} (Gruppe {{ wishDialogModel.participator.groupId }})
          </div>
          <q-separator />
          <q-list
            v-for="wish in getWishes(wishDialogModel.participator).wishes"
            :key="wish"
          >
            <q-item>
              <q-item-section
                :class="wish.ignored ? 'disabled' : ''"
              >
                <q-item-label
                  :style="'text-decoration: ' + (wish.ignored ? 'line-through' : 'none')"
                >
                  {{ wish.name }}
                </q-item-label>
              </q-item-section>
              <q-item-section side
                :class="wish.ignored ? 'disabled' : ''"
              >
                <q-icon
                  :name="'fas fa-' + (typeof wish.groupId !== 'undefined' ? groupList[wish.groupId].groupNumber : 'question')"
                  :color="typeof wish.groupId !== 'undefined' ? wish.groupId === wishDialogModel.participator.groupId ? 'green' : 'red' : 'blue'"
                  size="xs"
                />
              </q-item-section>
              <q-item-section side>
                <q-btn
                  flat
                  dense
                  size="xs"
                  :icon="wish.ignored ? 'far fa-eye' : 'far fa-eye-slash'"
                  :title="wish.ignored ? 'Ignorieren aufheben' : 'Ignorieren'"
                  @click="ignoreWish(v.p, wish)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Abbrechen"
            @click="closeWishDialog"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-toolbar>
      <q-select
        flat
        round
        dense
        label="Woche"
        class="q-ml-md"
        v-model="week"
        :options="weekOptions"
        @update:model-value="getParticipators"
        style="min-width: 100px"
      />
      <q-btn flat class="q-ml-md" :label="editable ? 'Bearbeiten beenden' : 'Bearbeiten'" @click="toggleEdit" />
      <q-btn flat class="q-ml-md" label="Gruppe Hinzufügen" @click="openAddGroupDialog" />
    </q-toolbar>

    <div class="q-pa-md row no-wrap">
      <div
        v-show="group.groupNumber !== 0 || editable"
        v-for="group in groupList.filter(group => group.type === 0 || group.type === 1)"
        :key="group.id"
        class="column"
      >
        <q-card
          class="q-pa-xs q-mx-xs"
          :style="'border-top: 5px solid ' + group.color + ';'"
          style="min-height: 150px;"
        >
          <q-card-section>
            <div class="text-subtitle1 row" style="justify-content: center; white-space: nowrap;">{{ (group.groupNumber ? 'Gruppe ' + group.groupNumber + ' - ' : '') + group.title }}</div>
          </q-card-section>
          <q-card-section
            v-if="group.id"
            :set="info={ p: getParticipatorsInfoByObj(group), u: getUserInfoByGroup(group) }"
            class="q-pa-none"
          >
            <div
              class="row"
              style="justify-content: space-between;"
            >
              <q-item
                class="q-pa-xs"
              >
                <q-item-section>
                  <q-item-label>
                    {{ info.p.count }} TN
                  </q-item-label>
                  <q-item-label caption>
                    {{ info.p.m }} m /
                    {{ info.p.f }} w
                  </q-item-label>
                  <q-item-label caption>
                    {{ info.p.avg }} Jahre
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                class="q-pa-xs"
              >
                <q-item-section>
                  <q-item-label>
                    {{ info.u.count }} MA
                  </q-item-label>
                  <q-item-label caption>
                    {{ info.u.m }} m /
                    {{ info.u.f }} w
                  </q-item-label>
                  <q-item-label caption>
                    {{ info.u.avg }} Jahre
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div
              class="q-pa-xs text-caption"
              v-if="info.u.count && info.p.count && info.p.m && info.p.f && info.u.m && info.u.f"
            >
              <div>
                {{ (info.p.count / info.u.count).toFixed(2) }} TN pro MA
              </div>
              <div>
                {{ (info.p.m / info.u.m).toFixed(2) }} TN pro MA <q-icon name="fas fa-mars" color="blue"/>
              </div>
              <div>
                {{ (info.p.f / info.u.f).toFixed(2) }} TN pro MA <q-icon name="fas fa-venus" color="pink"/>
              </div>

            </div>
          </q-card-section>
          <q-separator
            v-if="group.id"
          />
          <q-card-section
            class="q-pa-none"
            v-if="group.id"
          >
            <div class="q-pa-xs text-subtitle2" style="white-space: nowrap;">Mitarbeiter</div>
            <q-list
              v-for="user in group.GroupUsers"
              :key="user"
            >
              <q-item
                class="q-pa-xs q-my-xs"
                style="border: 1px solid grey; border-radius: 5px;"
                :to="'/l/profile/' + user.uuid"
              >
                <q-item-section no-wrap>
                  <q-item-label>
                    {{ user.User.firstName }} {{ user.User.lastName }}
                    <q-icon
                      v-if="user.type === 2"
                      name="fas fa-bolt"
                      color="yellow"
                      title="GL"
                    />
                  </q-item-label>
                  <q-item-label caption>
                    <q-icon
                      :name="'fas fa-' + (user.User.gender === 'w' ? 'venus' : 'mars')"
                      :color="user.User.gender === 'w' ? 'pink' : 'blue'"
                      :title="user.User.gender === 'w' ? 'weiblich' : 'männlich'"
                    />
                    <q-icon
                      :name="'fas fa-guitar'"
                      :color="getSkillColor(user.User.UserYears[0].guitar)"
                      :title="$constants.engagement.roles.guitar.options.find(o => o.value === user.User.UserYears[0].guitar).label"
                      class="q-pl-xs"
                    />
                  </q-item-label>
                </q-item-section>
                <q-item-section side no-wrap>
                  <q-item-label :title="getFormattedBirthday(user.User)">
                    {{ getAge(user.User) }}
                  </q-item-label>
                  <q-item-label caption
                    style="max-width: 150px; overflow: hidden; text-overflow: ellipsis;"
                    :title="user.User.church"
                  >
                    {{ user.User.church }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-separator />
          <q-card-section
            class="q-pa-none"
          >
            <div class="q-pa-xs text-subtitle2" style="white-space: nowrap;">Teilnehmer</div>
            <q-list
              :id="'groupPreference-list-' + group.id"
            >
              <q-item
                v-for="preference in group.Preferences"
                :key="preference"
                style="min-height: 0px; user-select: none; border-radius: 5px; border: 1px solid grey;"
                class="q-pa-xs q-my-xs column"
                :id = "'preference-item-' + preference.id"
              >
                <q-item
                  class="q-pa-xs"
                  :set="pInfo = getParticipatorsInfoByObj(preference)"
                >
                  <q-item-section
                    no-wrap
                    class="q-pt-none"
                  >
                    <q-item-label>
                      {{ preference.Participators.length }} TN
                    </q-item-label>
                    <q-item-label caption>
                      {{ pInfo.m }} m /
                      {{ pInfo.f }} w
                    </q-item-label>
                    <q-item-label caption>
                      {{ pInfo.avg }} Jahre
                    </q-item-label>
                  </q-item-section>
                  <q-item-section
                    side
                    style="justify-content: space-between;"
                  >
                    <q-item-label>
                      <q-btn
                        v-if=" editable && !preference.Participators.length"
                        flat
                        dense
                        size="xs"
                        icon="far fa-circle-xmark"
                        @click="deletePreference(preference)"
                      />
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item-section>
                  <q-list
                    :id = "'preference-list-' + preference.id"
                    class="q-pt-xs"
                  >
                    <q-item
                      v-for="participator in preference.Participators"
                      :key="participator"
                      style="min-height: 0px; user-select: none; border: 1px solid grey; border-radius: 5px;"
                      :id="'participator-item-' + getParticipatorId(participator)"
                      clickable
                      class="q-mt-xs"
                      :to="editable ? null : '/l/leader/participator/' + participator.orderId + '/' + participator.positionId"
                      @click="editable ? openShowWishDialog(participator, group) : null"
                    >
                      <q-item-section
                        no-wrap
                        >
                        <q-item-label>{{ participator.firstName }} {{ participator.lastName }}</q-item-label>
                        <q-item-label caption>
                          <q-icon
                            :name="'fas fa-' + (participator.sex === 'weiblich' ? 'venus' : 'mars')"
                            :color="participator.sex === 'weiblich' ? 'pink' : 'blue'"
                            :title="participator.sex"
                          />
                          <span
                            :set="wishes = getWishes(participator, group)"
                            :style="'color: ' + wishes.color"
                            class="q-pl-sm"
                          >
                            {{ wishes.unignoredFulfilledWishes.length }}/{{ wishes.unignoredWishes.length }}
                          </span>
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-item-label :title="getFormattedBirthday(participator)">
                          {{ getAge(participator) }}
                        </q-item-label>
                        <q-item-label caption>
                          {{ participator.city }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
        <q-btn
          v-if="editable"
          label="Block hinzufügen"
          flat
          dense
          @click="addPreference(group)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { api } from "src/boot/axios";
import { getCurrentInstance, defineComponent, ref } from "vue";
import Sortable from "sortablejs";
import moment from "moment";

export default defineComponent({
  name: "GroupPage",

  setup() {
    const { proxy } = getCurrentInstance();
    const c = proxy.$constants
    const showAddGroupDialog = ref(false);
    const showWishDialog = ref(false);
    const wishDialogModel = ref({});
    const settings = proxy.$settings;
    const editable = ref(false);
    const groupList = ref([]);
    const participators = ref({});
    const groupPreference = ref({});
    const newGroup = ref({});
    const sortables = ref([]);
    const weekOptions = ref([
      { label: 'Teens', value: 1 },
      { label: 'Kids', value: 2 },
    ]);
    const week = ref(weekOptions.value[0]);
    const type = ref(1);
    const typeOptions = ref([
      { label: 'Zeltgruppe', value: 1 },
      { label: 'Infrastruktur', value: 2 },
    ]);

    const toggleEdit = () => {
      editable.value = !editable.value;
      if (editable.value) {
        resetSortables();
      } else {
        sortables.value.forEach(sortable => {
          sortable.destroy();
          sortables.value = [];
        });
      }
    };

    const resetSortables = () => {
        groupList.value.forEach((group, index) => {
          const el = document.getElementById('groupPreference-list-' + group.id);
          if (!el) return;
          if (group.id) {
            sortables.value.push(Sortable.create(el, {
              group: 'preference',
              animation: 150,
              onEnd: (event) => {
                const preferenceId = +event.item.id.split('-')[2];
                const fromId = +event.from.id.split('-')[2];
                const toId = +event.to.id.split('-')[2];
                if (fromId !== toId) {
                  if (toId) {
                    api.post('/preference/'+ preferenceId, {
                      groupId: toId
                    }).then(refreshGroups);
                  }
                }
              }
            }));
          }
          group.Preferences.forEach((preference, index) => {
            const el = document.getElementById('preference-list-' + preference.id);
            if (!el) return;
            sortables.value.push(Sortable.create(el, {
              group: 'participator',
              animation: 150,
              onEnd: (event) => {
                const orderId = event.item.id.split('-')[2];
                const positionId = event.item.id.split('-')[3];
                const fromId = +event.from.id.split('-')[2];
                const toId = +event.to.id.split('-')[2];
                if (fromId !== toId) {
                  api.post('/participator/'+ orderId + '/' + positionId, {
                    preferenceId: toId || null
                  }).then(refreshGroups);
                }
              }
            }));
          });
        });
    };

    const openAddGroupDialog = () => {
      newGroup.value = {
        year: settings.currentYear,
        week: week.value.value,
        groupNumber: groupList.value.length,
        title: "",
        color: "",
        type: typeOptions.value[0]
      };
      showAddGroupDialog.value = true;
    };

    const closeAddGroupDialog = () => {
      showAddGroupDialog.value = false;
    };

    const openShowWishDialog = (p, g) => {
      wishDialogModel.value['participator'] = p;
      wishDialogModel.value['group'] = g;
      showWishDialog.value = true;
    };

    const closeWishDialog = () => {
      showWishDialog.value = false;
    };

    const addPreference = (group) => {
      api.post('/preference', {
        groupId: group.id
      }).then(refreshGroups);
    };

    const deletePreference = (preference) => {
      api.delete('/preference/' + preference.id).then(refreshGroups);
    };

    const refreshGroups = () => {
      api.get('/group?year=' + settings.currentYear + '&week=' + week.value.value + '&participatorBundle&userBundle').then((response) => {
        for (let p in participators.value) {
          participators.value[p].groupId = 0;
          participators.value[p].preferenceId = 0;
          participators.value[p].ignoredWishes = '';
        }
        groupList.value = response.data;
        groupList.value.forEach((group, groupIndex) => {
          group.Preferences.forEach((preference, preferenceIndex) => {
            preference.Participators.forEach((participator, participatorIndex) => {
              const pId = getParticipatorId(participator);
              participators.value[pId].groupId = group.id;
              participators.value[pId].preferenceId = preference.id;
              participators.value[pId].ignoredWishes = participator.ignoredWishes;
              groupList.value[groupIndex].Preferences[preferenceIndex].Participators[participatorIndex] = participators.value[pId];
            })
          });
        });
        groupList.value.push({
          id: 0,
          year: settings.currentYear,
          week: week.value,
          groupNumber: 0,
          title: "Nicht zugeordnet",
          color: "",
          type: 0,
          Preferences: [{
            id: 0,
            groupId: 0,
            Participators: Object.values(participators.value).filter(p => !p.groupId)
          }]
        });
        groupList.value = groupList.value.sort((a, b) => a.groupNumber - b.groupNumber);
      });
    };

    const getParticipators = () => {
      api
        .get("/participator")
        .then(function (response) {
          participators.value = [];
          Object.entries(response.data).forEach((entry) => {
            const [index, item] = entry;
            if (item.week === week.value.label.toLowerCase() && item.status === 1) {
              participators.value[getParticipatorId(item)] = item;
            }
          });
          refreshGroups();
        })
        .catch(function (e) {

        });
    }

    const addGroup = () => {
      let values = newGroup.value;
      values.type = values.type.value;
      api.post("/group", newGroup.value).then(refreshGroups);
      closeAddGroupDialog();
    };

    const getParticipatorId = (participator) => {
      return participator.orderId + '-' + participator.positionId;
    };

    const getFormattedBirthday = (participator) => {
      return moment(participator.birthday).format('DD.MM.YYYY');
    };

    const getAge = (participator) => {
      const birthday = moment(participator.birthday);
      const today = moment();
      return today.diff(birthday, 'years', true).toFixed(2);
    };

    const getWishes = (participator) => {
      let wishes = [];
      let color = '';
      if (participator.wishes === "Ja") {
        for (let i = 1; i <= 5; i++) {
          if (participator["wish" + i]) {
            wishes.push({
              name: participator["wish" + i],
              wishIndex: i,
              ignored: participator.ignoredWishes?.includes(i)
            });
          }
        }
      }
      wishes.forEach((wish, i) => {
        for (const [key, value] of Object.entries(participators.value)) {
          const firstNames = value.firstName.split(' ');
          if (firstNames.some((e) => wish.name.includes(e)) && wish.name.includes(value.lastName)) {
            wishes[i].groupId = value.groupId;
          }
        }
      });

      const unignoredWishes = wishes.filter(wish => !wish.ignored);
      const unignoredFulfilledWishes = wishes.filter(wish => !wish.ignored && wish.groupId === participator.groupId);
      const unignoredUnknownWishes = wishes.filter(wish => !wish.ignored && typeof wish.groupId === 'undefined');

      if (unignoredWishes.length === 0) {
        color = 'grey';
      } else if (unignoredWishes.length === unignoredFulfilledWishes.length) {
        color = 'green';
      } else if (unignoredUnknownWishes.length > 0) {
        color = 'blue';
      } else if (unignoredFulfilledWishes.length > 0) {
        color = 'orange';
      } else {
        color = 'red';
      }

      return {
        'wishes': wishes,
        'unignoredWishes': unignoredWishes,
        'unignoredFulfilledWishes': unignoredFulfilledWishes,
        'color': color
      }
    };

    const getParticipatorsInfoByObj = (obj) => {
      let preferences = [];
      if (typeof obj.Preferences === 'undefined') {
        preferences = [obj];
      } else {
        preferences = obj.Preferences;
      }
      const ps = [];
      preferences.forEach((preference) => {
        preference.Participators.forEach((p) => {
          ps.push(p);
        });
      });
      const ages = ps.map(p => +getAge(p));
      const avg = (ages.reduce((a, b) => a + b, 0) / ages.length).toFixed(2);
      const m = ps.filter(p => p.sex === 'männlich').length;
      const f = ps.filter(p => p.sex === 'weiblich').length;
      return {
        'count': ps.length,
        'avg': avg,
        'm': m,
        'f': f
      }
    }

    const getUserInfoByGroup = (group) => {
      const groupUsers = group.GroupUsers || [];
      let users = [];
      groupUsers.forEach((gu) => {
        users.push(gu.User);
      });
      const ages = users.map(u => +getAge(u));
      const avg = (ages.reduce((a, b) => a + b, 0) / ages.length).toFixed(2);
      const m = users.filter(u => u.gender === 'm').length;
      const f = users.filter(u => u.gender === 'w').length;
      return {
        'count': users.length,
        'avg': avg,
        'm': m,
        'f': f
      }
    }

    const getSkillColor = (skill) => {
      let color = '';
      switch (skill) {
        case 0:
          color = 'red';
          break;
        case 1:
          color = 'orange';
          break;
        case 2:
          color = 'yellow';
          break;
        case 3:
          color = 'green';
          break;
        default:
          color = 'grey';
          break;
      }
      return color;
    }

    const ignoreWish = (p, w) => {
      let ignoredWishes = p.ignoredWishes?.split('-').filter(a => a && !isNaN(a)) || [];
      if (w.ignored) {
        ignoredWishes.splice(ignoredWishes.indexOf(w.wishIndex.toString()), 1);
      } else {
        ignoredWishes.push(w.wishIndex);
      }
      api.post('/participator/' + p.orderId + '/' + p.positionId, {
        ignoredWishes: ignoredWishes.join('-')
      }).then(refreshGroups);
    }

    getParticipators();

    return {
      showAddGroupDialog,
      showWishDialog,
      wishDialogModel,
      newGroup,
      weekOptions,
      typeOptions,
      groupList,
      participators,
      groupPreference,
      week,
      editable,
      openAddGroupDialog,
      closeAddGroupDialog,
      openShowWishDialog,
      closeWishDialog,
      addGroup,
      toggleEdit,
      resetSortables,
      getAge,
      getFormattedBirthday,
      getWishes,
      getParticipatorId,
      addPreference,
      deletePreference,
      getParticipators,
      getParticipatorsInfoByObj,
      getUserInfoByGroup,
      getSkillColor,
      ignoreWish,
      refreshGroups
    };
  },
  updated() {
    if (this.editable) {
      this.resetSortables();
    }
  }
});
</script>
