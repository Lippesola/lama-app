<template>
  <div
    v-if="isLoaded"
  >
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
              min=1
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
            :label="newGroup.id ? 'Speichern' : 'Hinzufügen'"
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
            Wünsche von {{ wishDialogModel.participator.firstName }} {{ wishDialogModel.participator.lastName }} (Gruppe {{ groupList.find(g => wishDialogModel.participator.groupId === g.id)?.groupNumber }})
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
                  :name="'fas fa-' + (typeof wish.groupId !== 'undefined' ? groupList.find(g => wish.groupId === g.id)?.groupNumber : 'question')"
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
      <q-btn
        flat
        class="q-ml-md"
        label="MA Bearbeiten"
        @click="toggleUserEdit"
        :color="editableUser ? 'primary' : ''"
      />
      <q-btn
        flat
        class="q-ml-md"
        label="TN Bearbeiten"
        @click="toggleParticipatorEdit"
        :color="editableParticipator ? 'primary' : ''"
      />
      <q-btn
        flat
        class="q-ml-md"
        label="Gruppe bearbeiten"
        @click="toggleGroupEdit"
        :color="editableGroup ? 'primary' : ''"
      />
      <q-btn
        v-if="editableGroup"
        flat
        class="q-ml-md"
        icon="fas fa-plus"
        label="Gruppe hinzufügen"
        @click="openAddGroupDialog()"
      />
    </q-toolbar>

    <div class="q-pa-md row no-wrap">
      <div
        v-show="group.groupNumber !== 0 || editableParticipator || editableUser"
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
            <div class="text-subtitle1 row" style="justify-content: center; white-space: nowrap;">
              {{ (group.groupNumber ? 'Gruppe ' + group.groupNumber + ' - ' : '') + group.title }}
              <q-btn
                v-if="editableGroup && group.id"
                class="q-ml-md"
                flat
                dense
                size="xs"
                icon="fas fa-pen"
                @click="openAddGroupDialog(group.id)"
              />
            </div>
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
            v-if="group.id || editableUser"
          >
            <div class="q-pa-xs text-subtitle2" style="white-space: nowrap;">Mitarbeiter</div>
            <q-list
              :id="'groupUser-list-' + group.id"
            >
              <q-item
                v-for="groupUser in group.GroupUsers"
                :key="groupUser"
                class="q-pa-xs q-my-xs"
                style="border: 1px solid grey; border-radius: 5px;"
                :to="'/l/profile/' + groupUser.uuid"
                :id="'groupUser-item-' + groupUser.uuid"
              >
                <q-item-section no-wrap>
                  <q-item-label>
                    {{ users[groupUser.uuid].firstName }} {{ users[groupUser.uuid].lastName }}
                    <q-icon
                      v-if="groupUser.type === 2"
                      name="fas fa-bolt"
                      color="yellow"
                      title="GL"
                    />
                  </q-item-label>
                  <q-item-label caption>
                    <q-icon
                      :name="'fas fa-' + (users[groupUser.uuid].gender === 'w' ? 'venus' : 'mars')"
                      :color="users[groupUser.uuid].gender === 'w' ? 'pink' : 'blue'"
                      :title="users[groupUser.uuid].gender === 'w' ? 'weiblich' : 'männlich'"
                    />
                    <q-icon
                      :name="'fas fa-guitar'"
                      :color="getSkillColor(users[groupUser.uuid].guitar)"
                      :title="$constants.engagement.roles.guitar.options.find(o => o.value === users[groupUser.uuid].guitar).label"
                      class="q-pl-xs"
                    />
                  </q-item-label>
                </q-item-section>
                <q-item-section side no-wrap>
                  <q-item-label :title="getFormattedBirthday(users[groupUser.uuid])">
                    {{ getAge(users[groupUser.uuid]) }}
                  </q-item-label>
                  <q-item-label caption
                    style="max-width: 150px; overflow: hidden; text-overflow: ellipsis;"
                    :title="users[groupUser.uuid].church"
                  >
                    {{ users[groupUser.uuid].church }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-separator
            v-if="group.id"
          />
          <q-card-section
            v-if="group.id || editableParticipator"
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
                        v-if=" editableParticipator && !preference.Participators.length"
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
                      :to="editableParticipator ? null : '/l/leader/participator/' + participator.orderId + '/' + participator.positionId"
                      @click="editableParticipator ? openShowWishDialog(participator, group) : null"
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
          v-if="editableParticipator"
          label="Block hinzufügen"
          flat
          dense
          @click="addPreference(group)"
        />
      </div>
    </div>
  </div>
  <div
    v-else
    class="q-pa-md flex flex-center full-height"
  >
    <q-spinner-puff
      color="primary"
      size="50px"
    />
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
    const isLoaded = ref(false);
    const showAddGroupDialog = ref(false);
    const showWishDialog = ref(false);
    const wishDialogModel = ref({});
    const settings = proxy.$settings;
    const editableUser = ref(false);
    const editableParticipator = ref(false);
    const editableGroup = ref(false);
    const groupList = ref([]);
    const participators = ref({});
    const users = ref({});
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

    const toggleEditMode = (mode) => {
      if ((editableUser.value || editableParticipator.value) && 
        (mode !== 'user' && mode !== 'participator' || 
         !editableUser.value && !editableParticipator.value)) {
      sortables.value.forEach(sortable => sortable.destroy());
      sortables.value = [];
      }
      
      editableUser.value = false;
      editableParticipator.value = false;
      editableGroup.value = false;
      
      if (mode === 'user') {
        editableUser.value = true;
        resetSortables();
      } else if (mode === 'participator') {
        editableParticipator.value = true;
        resetSortables();
      } else if (mode === 'group') {
        editableGroup.value = true;
      }
    };

    const toggleUserEdit = () => {
      editableUser.value ? toggleEditMode(null) : toggleEditMode('user');
    };
 
    const toggleParticipatorEdit = () => {
      editableParticipator.value ? toggleEditMode(null) : toggleEditMode('participator');
    };

    const toggleGroupEdit = () => {
      editableGroup.value ? toggleEditMode(null) : toggleEditMode('group');
    };

    const resetSortables = () => {
      if (editableParticipator.value) {
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
      } else if (editableUser.value) {
        groupList.value.forEach((group, index) => {
          const el = document.getElementById('groupUser-list-' + group.id);
          if (!el) return;
          sortables.value.push(Sortable.create(el, {
            group: 'user',
            animation: 150,
            onEnd: async (event) => {
              console.log(event);
              
              const uuid = event.item.id.split('-').splice(2).join('-');
              const fromId = +event.from.id.split('-')[2];
              const toId = +event.to.id.split('-')[2];
              if (fromId !== toId) {
                if (fromId) {
                  await api.delete('/groupUser/' + fromId + '/' + uuid)
                }
                if (toId) {
                  await api.post('/groupUser/' + toId + '/' + uuid);
                }
                refreshGroups();
              }
            }
          }));
        });
      }
    };

    const openAddGroupDialog = (groupId) => {
      if (groupId) {
        newGroup.value = groupList.value.find(g => g.id === groupId);
      } else {
        newGroup.value = {
          year: settings.currentYear,
          week: week.value.value,
          groupNumber: groupList.value.length,
          title: "",
          color: "",
          type: typeOptions.value[0]
        };
      }
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
      api.get('/group?year=' + settings.currentYear + '&week=' + week.value.value + '&participatorBundle&groupUserBundle').then((response) => {
        for (let p in participators.value) {
          participators.value[p].groupId = 0;
          participators.value[p].preferenceId = 0;
          participators.value[p].ignoredWishes = '';
        }
        for (let u in users.value) {
          users.value[u].groupId = 0;
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
          group.GroupUsers.forEach((groupUser, userIndex) => {
            const uId = groupUser.uuid;
            
            users.value[uId].groupId = group.id;
          });
        });
        let groupUsers = [];
        Object.entries(users.value).forEach((entry) => {
          const [index, item] = entry;
          if (item.groupId === 0) {
            groupUsers.push({
              uuid: item.uuid,
              type: 0,
              groupId: 0
            });
          }
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
          }],
          GroupUsers: groupUsers
        });
        groupList.value = groupList.value.sort((a, b) => a.groupNumber - b.groupNumber);
        isLoaded.value = true;
      });
    };

    const getParticipators = () => {
      isLoaded.value = false;
      const promise = api
        .get("/participator")
        .then(function (response) {
          participators.value = [];
          Object.entries(response.data).forEach((entry) => {
            const [index, item] = entry;
            if (item.week === week.value.label.toLowerCase() && item.status === 1) {
              participators.value[getParticipatorId(item)] = item;
            }
          });
        })
        .catch(function (e) {

        });
      return promise;
    }

    const getUsers = () => {
      isLoaded.value = false;
      const promise = api.get('/userYear?status=4&year=' + settings.currentYear + '&userBundle').then(function(response) {
          users.value = [];
          Object.entries(response.data).forEach((entry => {
            const [index, item] = entry
            let row = item
            Object.entries(item.UserModel).forEach((entry => {
              const [index, item] = entry
              row[index] = item
            }))
            delete row.UserModel;
            users.value[row.uuid] = row;
          }))
        }).catch(function(e) {})
      return promise;
    };

    const addGroup = () => {
      let values = newGroup.value;
      values.type = values.type.value;
      api.post("/group/" + (values.id || ''), values).then(refreshGroups);
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
      const groupUsers = [];
      group.GroupUsers || [].forEach((gu) => {
        u.push(users.value[gu.uuid]);
      });
      const ages = groupUsers.map(u => +getAge(u));
      const avg = (ages.reduce((a, b) => a + b, 0) / ages.length).toFixed(2);
      const m = groupUsers.filter(u => u.gender === 'm').length;
      const f = groupUsers.filter(u => u.gender === 'w').length;
      return {
        'count': groupUsers.length,
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

    const participatorPromise = getParticipators();
    const userPromise = getUsers();
    Promise.all([participatorPromise, userPromise]).then(() => {
      refreshGroups();
    });

    return {
      isLoaded,
      showAddGroupDialog,
      showWishDialog,
      wishDialogModel,
      newGroup,
      weekOptions,
      typeOptions,
      groupList,
      participators,
      users,
      groupPreference,
      week,
      editableUser,
      editableParticipator,
      editableGroup,
      openAddGroupDialog,
      closeAddGroupDialog,
      openShowWishDialog,
      closeWishDialog,
      addGroup,
      toggleUserEdit,
      toggleParticipatorEdit,
      toggleGroupEdit,
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
    if (this.editableParticipator || this.editableUser) {
      this.resetSortables();
    }
  }
});
</script>
