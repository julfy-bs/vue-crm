<template>
  <div class="app-page">
    <div>
      <div class="page-title">
        <h3>{{ "ProfileTitle" | localize }}</h3>
      </div>

      <form class="form" @submit.prevent="submitHandler">
        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model="name"
            :class="{
              invalid: $v.name.$dirty && !$v.name.required
            }"
          />
          <label for="name">{{ "Name" | localize }}</label>
          <small
            class="helper-text invalid"
            v-if="$v.name.$dirty && !$v.name.required"
          >
            {{ "MESSAGE_EnterName" | localize }}</small
          >
        </div>

        <div class="switch">
          <label>
            {{ "LANGUAGE_English" | localize }}
            <input type="checkbox" v-model="isRuLocale" />
            <span class="lever"></span>
            {{ "LANGUAGE_Russian" | localize }}
          </label>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          {{ "BUTTON_Update" | localize }}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { required } from "vuelidate/lib/validators";

export default {
  metaInfo() {
    return {
      title: this.$title("PageTitle_Profile")
    };
  },
  data: () => ({
    name: "",
    isRuLocale: true
  }),
  computed: {
    ...mapGetters(["info"])
  },
  validations: {
    name: { required }
  },
  methods: {
    ...mapActions(["updateInfo"]),
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        await this.updateInfo({
          name: this.name,
          locale: this.isRuLocale ? "ru-RU" : "en-US"
        });
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }
  },
  mounted() {
    this.name = this.info.name;
    this.isRuLocale = this.info.locale === "ru-RU";
    setTimeout(() => {
      window.M.updateTextFields();
    });
  }
};
</script>

<style scoped>
.switch {
  margin-bottom: 2rem;
}
</style>
