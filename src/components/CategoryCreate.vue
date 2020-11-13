<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{ "BUTTON_Create" | localize }}</h4>
      </div>
      <form @submit.prevent="submitHandler">
        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model="title"
            :class="{ invalid: $v.title.$dirty && !$v.title.required }"
          />
          <label for="name">{{ "SomethingName" | localize }}</label>
          <span
            class="helper-text invalid"
            v-if="$v.title.$dirty && !$v.title.required"
          >
            {{ "MESSAGE_EnterCategoryName" | localize }}
          </span>
        </div>
        <div class="input-field">
          <input
            id="limit"
            type="number"
            v-model.number="limit"
            :class="{ invalid: $v.limit.$dirty && !$v.limit.minValue }"
          />
          <label for="limit">{{ "Limit" | localize }}</label>
          <span
            class="helper-text invalid"
            v-if="$v.limit.$dirty && !$v.limit.minValue"
          >
            {{ "ERROR_MinLength" | localize }}
            {{ $v.limit.$params.minValue.min }}
          </span>
        </div>
        <button class="btn waves-effect waves-light" type="submit">
          {{ "BUTTON_Create" | localize }}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { required, minValue } from "vuelidate/lib/validators";
import localizeFilter from "@/filters/localize.filter";

export default {
  data: () => ({
    title: "",
    limit: ""
  }),
  validations: {
    title: { required },
    limit: { minValue: minValue(100) }
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        const category = await this.$store.dispatch("createCategory", {
          title: this.title,
          limit: this.limit
        });
        this.title = "";
        this.limit = "";
        this.$v.reset();
        this.$emit("created", category);
        this.$message(
          localizeFilter("ANNOUNCEMENT_CategoryCreatedSuccessfully")
        );
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }
  },
  mounted() {
    window.M.updateTextFields();
  }
};
</script>
