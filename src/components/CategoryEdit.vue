<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{ "Edit" | localize }}</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field">
          <select ref="select" v-model="current">
            <option v-for="c of categories" :key="c.id" :value="c.id"
              >{{ c.title }}
            </option>
          </select>
          <label>{{ "MESSAGE_SelectCategory" | localize }}</label>
        </div>

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
            :class="{
              invalid:
                ($v.limit.$dirty && !$v.limit.minValue) ||
                ($v.limit.$dirty && !$v.limit.required)
            }"
          />
          <label for="limit">{{ "Limit" | localize }}</label>
          <small
            class="helper-text invalid"
            v-if="$v.limit.$dirty && !$v.limit.required"
          >
            {{ "ERROR_RequiredNumber" | localize }}
          </small>
          <span
            class="helper-text invalid"
            v-if="$v.limit.$dirty && !$v.limit.minValue"
          >
            {{ "ERROR_MinLength" | localize }}
            {{ $v.limit.$params.minValue.min }}
          </span>
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
import { minValue, required } from "vuelidate/lib/validators";
import localizeFilter from "@/filters/localize.filter";

export default {
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    select: null,
    title: "",
    limit: 1,
    current: null
  }),
  validations: {
    title: { required },
    limit: { minValue: minValue(100), required }
  },
  watch: {
    current(catId) {
      const { title, limit } = this.categories.find(c => c.id === catId);
      this.title = title;
      this.limit = limit;
    }
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        const categoryData = {
          id: this.current,
          title: this.title,
          limit: this.limit
        };
        await this.$store.dispatch("updateCategory", categoryData);
        this.$message(
          localizeFilter("ANNOUNCEMENT_CategoryUpdatedSuccessfully")
        );
        this.$emit("updated", categoryData);
        // Добавить что-то в catch
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }
  },
  created() {
    const { id, title, limit } = this.categories[0];
    this.current = id;
    this.title = title;
    this.limit = limit;
  },
  mounted() {
    this.select = window.M.FormSelect.init(this.$refs.select);
    window.M.updateTextFields();
  },
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy();
    }
  }
};
</script>
