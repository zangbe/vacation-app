<template>
    <div style="width:1000px">
        <v-data-table :headers="headers" :items="vacation" class="elevation-4">
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>휴가 신청 내역</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="onClickRefreshButton">신청 내역 새로고침</v-btn>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-btn v-if="item.cancelable" color="warning" small @click="onClickCancelVacation(item)">휴가 취소</v-btn>
            </template>
            <template v-slot:no-data>
                <div>
                    <b>데이터가 없습니다</b>
                </div>
            </template>
        </v-data-table>
        <v-snackbar
            color="red"
            centered
            v-model="snackbar"
        >
        {{ text }}

            <template v-slot:action="{ attrs }">
                <v-btn
                dark
                text
                v-bind="attrs"
                @click="snackbar = false"
                >
                Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
export default {
    data() {
        return {
            snackbar: false,
            text: '',
            headers: [
                {text: '휴가 취소', value: 'actions', divider: true},
                {text: '게시글 번호', value: 'id', divider: true},
                {text: '휴가 시작일', value: 'startDate', divider: true},
                {text: '휴가 종료일', value: 'endDate', divider: true},
                {text: '휴가 사용 일수', value: 'days', divider: true},
                {text: '신청일', value: 'createdAt', divider: true},
                {text: '수정일', value: 'updatedAt', divider: true},
            ],
            list: [],
            id: ''
        }
    },

    watch: {
        'vacation': function(item) {
           item.forEach(element => {
               if(element.startDate) element.startDate = moment(element.startDate).format('YYYY-MM-DD');
               if(element.endDate) element.endDate = moment(element.endDate).format('YYYY-MM-DD');
               if(element.createdAt) element.createdAt = moment(element.createdAt).format('YYYY-MM-DD HH:mm:ss');
               if(element.updatedAt) element.updatedAt = moment(element.updatedAt).format('YYYY-MM-DD HH:mm:ss');
           });
        }
    },

    computed: {
        ...mapState({
            user: 'user',
            vacation: 'vacation'
        }),
    },

    methods: {

        ...mapActions([
            'FETCH_USER',
            'FETCH_VACATION',
            'UPDATE_VACATION'
        ]),

        onClickRefreshButton() {
            this.getVacations();
        },

        async onClickCancelVacation(item) {
            try {
                await this.UPDATE_VACATION({item});
                await this.FETCH_VACATION({userId: item.userId});
                await this.FETCH_USER({userId: item.userId})
            } catch (error) {
                this.text = error;
                this.snackbar = true;
            }
        },

        async getVacations() {
            try {
                await this.FETCH_VACATION({userId: this.user[0].id});
            } catch (error) {
                this.text = error;
                this.snackbar = true;
            }
        }
    },

    created() {
        this.getVacations();
    },
}
</script>