<template>
    <q-item
        class="q-pa-xs q-my-xs"
        style="border: 1px solid grey; border-radius: 5px;"
        :to="editableUser ? '' : '/l/profile/' + groupUser.uuid"
        :id="'groupUser-item-' + groupUser.uuid"
        @click="editableUser ? menuOpened = true : null"
    >
    <q-item-section no-wrap>
        <q-item-label>
        {{ user.firstName }} {{ user.lastName }}
        <q-icon
            v-if="groupUser.type === 2"
            name="fas fa-bolt"
            color="yellow"
            title="GL"
        />
        </q-item-label>
        <q-item-label caption>
        <q-icon
            :name="'fas fa-' + (user.gender === 'w' ? 'venus' : 'mars')"
            :color="user.gender === 'w' ? 'pink' : 'blue'"
            :title="user.gender === 'w' ? 'weiblich' : 'männlich'"
        />
        <q-icon
            :name="'fas fa-guitar'"
            :color="getSkillColor(user.guitar)"
            :title="$constants.engagement.roles.guitar.options.find(o => o.value === user.guitar).label"
            class="q-pl-xs"
        />
        <q-icon
            v-if="week"
            :name="'fas fa-calendar-alt'"
            :color="getSkillColor(user[week === 1 ? 'teens' : 'kids'])"
            :title="$constants.engagement.participation[week === 1 ? 'teens' : 'kids'].options.find(o => o.value === user[week === 1 ? 'teens' : 'kids']).label"
            class="q-pl-xs"
        />
        </q-item-label>
    </q-item-section>
    <q-item-section side no-wrap>
        <q-item-label :title="getFormattedBirthday(user)">
        {{ getAge(user) }}
        </q-item-label>
        <q-item-label caption
        style="max-width: 150px; overflow: hidden; text-overflow: ellipsis;"
        :title="user.church"
        >
        {{ user.church }}
        </q-item-label>
    </q-item-section>
        <q-menu v-model="menuOpened">
            <q-list style="min-width: 100px">
                <q-item
                    clickable
                    v-close-popup
                    @click = toggleLeader
                >
                    <q-item-section>
                        {{ groupUser.type === 2 ? 'Als GL entfernen' : 'Zum GL ernennen' }}
                    </q-item-section>
                </q-item>
                <q-item
                    clickable
                    v-close-popup
                    @click="goToProfile"
                >
                    <q-item-section>
                        Profil anzeigen
                    </q-item-section>
                </q-item>
            </q-list>
        </q-menu>
    </q-item>
</template>
<script>
    import { api } from "src/boot/axios";
    import { defineComponent, getCurrentInstance, ref } from 'vue'
    import moment from "moment";
    export default defineComponent({
        name: 'GroupUserItem',
        props: {
            groupUser: {
                type: Object,
                required: true
            },
            user: {
                type: Object,
                required: true
            },
            editableUser: {
                type: Boolean,
                default: false
            },
            week: {
                type: Number,
                default: 0
            }
        },
        setup(props) {
            const { proxy } = getCurrentInstance()
            const c = proxy.$constants
            const menuOpened = ref(false);

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
            const toggleLeader = async () => {
                const newType = props.groupUser.type === 2 ? 1 : 2;
                await api.post('/groupUser/' + props.groupUser.groupId + '/' + props.user.uuid, {
                    type: newType
                });
                props.groupUser.type = newType;
            }
            const getFormattedBirthday = (user) => {
                return moment(user.birthday).format('DD.MM.YYYY');
            }
            const getAge = (user) => {
                const birthday = moment(user.birthday);
                const today = moment();
                return today.diff(birthday, 'years', true).toFixed(2);
            }
            const goToProfile = () => {
                window.open('/l/profile/' + props.user.uuid, '_blank')
            }
            return {
                menuOpened,
                getSkillColor,
                getFormattedBirthday,
                getAge,
                toggleLeader,
                goToProfile
            }
        }
    })
</script>