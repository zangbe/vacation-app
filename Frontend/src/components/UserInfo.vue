<template>
    <div>
        <v-row>
            <v-col cols="2">
                <v-text-field label="사용자" readonly filled v-model="user[0].userId"></v-text-field>
            </v-col>
            <v-col cols="2">
                <v-text-field label="총 연차" readonly filled v-model="user[0].totalVacationDays"></v-text-field>
            </v-col>
            <v-col cols="2">
                <v-text-field label="사용 연차" readonly filled v-model="user[0].usedVacationDays"></v-text-field>
            </v-col>
            <v-col cols="2">
                <v-text-field label="남은 연차" readonly filled v-model="restDays"></v-text-field>
            </v-col>
            <v-col cols="2">
                <v-btn class="mb-1" color="success" @click="onClickApplyVacationButton">휴가 신청</v-btn>
                <v-btn color="primary" @click="onClickRefreshButton">사용자 정보 새로고침</v-btn>
            </v-col>
        </v-row>
        <v-dialog persistent v-model="dialog" max-width="600px">
            <v-card>
                <v-card-title class="headline">휴가 신청</v-card-title>

                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field label="남은 휴가" readonly filled v-model="restDays">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-select label="휴가 종류 선택" :items="vacationType" v-model="editedItem.days" @change="onChangeVacationType">
                            </v-select>
                        </v-col>
                        <v-col cols="12" v-if="showNotRange">
                            <v-menu
                                ref="menu2"
                                v-model="menu2"
                                :close-on-content-click="false"
                                :return-value.sync="editedItem.date"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="editedItem.date"
                                        label="휴가 날짜 선택"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker locale="ko-kr" show-current v-model="editedItem.date" no-title scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="$refs.menu2.save(editedItem.date)">OK</v-btn>
                                    <v-btn text color="primary" @click="menu2 = false">Cancel</v-btn>
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols="12" v-if="showRange">
                            <v-menu
                                ref="menu"
                                v-model="menu"
                                :close-on-content-click="false"
                                :return-value.sync="editedItem.dateRange"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="dateRangeText"
                                        label="휴가 날짜 선택 - 범위 선택 가능"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker locale="ko-kr" show-current v-model="editedItem.dateRange" range>
                                    <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="$refs.menu.save(editedItem.dateRange)">OK</v-btn>
                                    <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                    </v-row>
                </v-card-text>
                
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="onClickActionButton">휴가 신청</v-btn>
                    <v-btn color="green darken-1" text @click="onClickCloseButton">닫기</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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

    watch: {
        'editedItem.dateRange': function(item) {
            if(item.length === 2) {
                if(moment(item[0]).isSameOrAfter(moment(item[1]))) {
                    let tempDate = item[0];
                    item[0] = item[1];
                    item[1] = tempDate;
                }
            }
        }
    },

    computed: {
        ...mapState({
            user: 'user',
            vacation: 'vacation'
        }),

        dateRangeText() {
            return this.editedItem.dateRange.join(' ~ ');
        },

        restDays() {
            return this.user[0].totalVacationDays - this.user[0].usedVacationDays;
        }
    },

    data() {
        return {
            snackbar: false,
            text: '',
            showRange: false,
            showNotRange: false,
            menu: false,
            menu2: false,
            vacationType: [
                {text:'연차', value: 1},
                {text:'반차 - 0.5일', value: 0.5},
                {text:'반반차 - 0.25일', value: 0.25},
            ],
            id: '',
            userId: '',
            totalVacationDays: 0,
            usedVacationDays: 0,
            dialog: false,
            editedItem: {
                userId: '',
                dateRange: [],
                date: '',
                days: 0
            },
            defaultItem: {
                userId: '',
                dateRange: [],
                date: '',
                days: 0
            }
        }
    },

    methods: {

        ...mapActions([
            'FETCH_USER',
            'FETCH_VACATION',
            'CREATE_VACATION'
        ]),

        async onClickRefreshButton() {
            try {
                await this.FETCH_USER({userId: this.user[0].id});   
            } catch (error) {
                this.text = error;
                this.snackbar = true;
            }
        },

        onChangeVacationType() {
            if(this.editedItem.days < 1) {
                this.showRange = false;
                this.showNotRange = true;
            } else {
                this.showRange = true;
                this.showNotRange = false;
            }
        }, 

        onClickCloseButton() {
            Object.assign(this.editedItem, this.defaultItem);
            this.editedItem.userId = this.user[0].userId;
            this.dialog = false;
        },

        onClickApplyVacationButton() {
            this.dialog = true;
        },

        async onClickActionButton() {

            try {
                let startDate = '';
                let endDate = '';

                if(!this.editedItem.days) {
                    this.text = '휴가 종류를 선택하세요.';
                    this.snackbar = true;
                    return;
                }

                if(this.editedItem.days === 1) {

                    if(this.editedItem.dateRange.length < 2) {
                        this.text = '날짜 범위를 선택하세요.';
                        this.snackbar = true;
                        return;
                    }

                    startDate = this.editedItem.dateRange[0];
                    endDate = this.editedItem.dateRange[1];
                } else {

                    if(!this.editedItem.date) {
                        this.text = '날짜를 선택하세요.';
                        this.snackbar = true;
                        return;
                    }

                    startDate = this.editedItem.date;
                    endDate = this.editedItem.date;
                }

                const isNotValid = this.validateDate(startDate, endDate);

                if(isNotValid) {
                    this.text = '휴가 시작일 또는 종료일이 기존 신청 내역에 존재 합니다. 날짜를 다시 선택하세요.';
                    this.snackbar = true;
                    return;
                }

                const result = await this.CREATE_VACATION({
                    userId: this.user[0].id,
                    startDate: startDate,
                    endDate: endDate,
                    days: this.editedItem.days
                });

                if(result.status === 200) {
                    await this.FETCH_USER({userId: this.user[0].id});
                    await this.FETCH_VACATION({userId: this.user[0].id});
                    this.dialog = false;
                    Object.assign(this.editedItem, this.defaultItem);
                } else {
                    this.text = '휴가 신청 실패. 다시 신청하세요.';
                    this.snackbar = true;
                }

            } catch (error) {
                this.text = error;
                this.snackbar = true;
            }
        },

        validateDate(startDate, endDate) {
            let isNotValid = false;

            this.vacation.forEach(vacation => {

                if(moment(vacation.startDate).isBetween(startDate, endDate, null, '[]')) {
                    isNotValid = true;
                }

                if(moment(vacation.endDate).isBetween(startDate, endDate, null, '[]')) {
                    isNotValid = true;
                }
            });

            return isNotValid;
        },
    },
}
</script>