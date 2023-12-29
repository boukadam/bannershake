<template>
  <div>
    <v-dialog v-model="open" scrollable max-width="800px" :fullscreen="$vuetify.breakpoint.xs">
      <v-card max-height="700px">
        <v-card-title>
          <span>{{ $t('feedback.title') }}</span>
          <v-spacer></v-spacer>
          <v-icon @click="closeDialog">mdi-close</v-icon>
        </v-card-title>
        <v-divider></v-divider>
        <v-form ref="form">
          <v-card-text class="my-4 font-weight-light text-md-h5 text-h6 text-justify">
            <span v-html="$t('feedback.text')"></span>
            <v-text-field v-model="feedbackEmail" :label="$t('feedback.emailField')" append-icon="mdi-email"></v-text-field>
            <v-textarea
                v-model="feedbackComment"
                :label="$t('feedback.commentField')"
                auto-grow
                rows="1"
                append-icon="mdi-comment"
                :rules="[value => !!value || $t('feedback.requiredField')]"
            ></v-textarea>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success" text x-large @click="postFeedback" :loading="feedbackSubmitLoading">{{ $t('feedback.send') }}</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import emailjs from '@emailjs/browser';

export default {
  props: {
    value: {
      type: Boolean,
      default: () => false
    }
  },
  data: () => ({
    open: false,
    feedbackEmail: null,
    feedbackComment: null,
    feedbackSubmitLoading: false
  }),
  watch: {
    value(newVal) {
      this.open = newVal;
    }
  },
  methods: {
    closeDialog() {
      this.$refs.form.reset();
      this.open = false;
      this.$emit('input', this.open);
    },
    postFeedback() {
      this.feedbackSubmitLoading = true;
      let data = {
        from_name: this.feedbackEmail,
        message: this.feedbackComment
      }

      emailjs.send('bannershake', 'feedback', data, process.env.VUE_APP_EMAILS_JS_KEY)
        .then((result) => {
          let message = ''
          let type = 'success'
          if (result.status === 200) {
            message = this.$t('feedback.successMsg');
          } else {
            message = this.$t('feedback.errorMsg');
            type = 'error'
          }
          this.$notify({
            title: this.$t('feedback.title'),
            type: type,
            text: message
          })
        }, (error) => {
          this.$notify({
            title: this.$t('feedback.title'),
            type: 'error',
            text: this.$t('feedback.errorMsg')
          })
          console.log('Fail to send feedback message', error.text);
        })
        .finally(() => {
          this.closeDialog();
          this.feedbackSubmitLoading = false;
        })
    }
  }
}
</script>