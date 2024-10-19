<template>
  <v-dialog v-model="model" scrollable max-width="800px" :fullscreen="mobile">
    <v-card max-height="700px">
      <div class="d-flex flex-row ma-4">
        <span class="text-h6">{{ t('feedback.title') }}</span>
        <v-spacer></v-spacer>
        <v-icon @click="closeDialog">mdi-close</v-icon>
      </div>
      <v-divider></v-divider>
      <v-form ref="form" >
        <v-card-text class="my-4 font-weight-light text-h6 text-justify">
          <p>
            {{ t('feedback.text1') }}
          </p>
          <p>
            {{ t('feedback.text2') }}
          </p>
          <v-text-field v-model="feedbackEmail" class="mt-2" :label="t('feedback.emailField')" append-icon="mdi-email"></v-text-field>
          <v-textarea
              v-model="feedbackComment"
              :label="t('feedback.commentField')"
              auto-grow
              rows="1"
              append-icon="mdi-comment"
              :rules="[value => !!value || t('feedback.requiredField')]"
          ></v-textarea>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" variant="text" x-large @click="postFeedback" :loading="feedbackSubmitLoading">{{ t('feedback.send') }}</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {useDisplay} from "vuetify";
import {ref} from "vue";
import emailjs from "@emailjs/browser"
import {useNotification} from "@kyvg/vue3-notification";

const model = defineModel<boolean>()
const closeDialog = () => {
  model.value = false
}

const {t} = useI18n()
const {mobile} = useDisplay()

const feedbackEmail = ref(null)
const feedbackComment = ref(null)
const feedbackSubmitLoading = ref(false)

const { notify }  = useNotification()

const postFeedback = () => {
  feedbackSubmitLoading.value = true;
  let data = {
    from_name: feedbackEmail.value,
    message: feedbackComment.value
  }

  emailjs.send('bannershake', 'feedback', data, import.meta.env.VITE_EMAILS_JS_KEY)
      .then((result) => {
        let message = ''
        let type = 'success'
        if (result.status === 200) {
          message = t('feedback.successMsg');
        } else {
          message = t('feedback.errorMsg');
          type = 'error'
        }
        notify({
          title: t('feedback.title'),
          type: type,
          text: message
        })
      }, (error) => {
        notify({
          title: t('feedback.title'),
          type: 'error',
          text: t('feedback.errorMsg')
        })
        console.log('Fail to send feedback message', error);
      })
      .finally(() => {
        model.value = false;
        feedbackSubmitLoading.value = false;
      })
}
</script>