import { defineStore } from 'pinia'


export const userstatedata = defineStore('user', {
    state: () => ({
        name: '',
        email: '',
        avatar: '',
    }),
    actions: {
        setUser(data){
            this.name = data.name,
            this.email = data.email,
            this.avatar = data.avatar
        },
        logout() {
            this.name = ''
            this.email = ''
            this.avatar = ''
        }
    }
});