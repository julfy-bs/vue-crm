<template>
  <div class="app-page">
    <div>
      <div class="page-title">
        <h3>{{ "SIDEBAR-MENU_NewRecord" | localize }}</h3>
      </div>

      <Loader v-if="loading" />

      <p class="center" v-else-if="!categories.length">
        {{ "EMPTY_NoCategories" | localize }}
        <router-link to="/categories">
          {{ "EMPTY_AddCategory" | localize }}
        </router-link>
      </p>

      <form class="form" v-else @submit.prevent="submitHandler">
        <div class="input-field">
          <select ref="select" v-model="current">
            <option v-for="c of categories" :key="c.id" :value="c.id"
              >{{ c.title }}
            </option>
          </select>
          <label>{{ "MESSAGE_SelectCategory" | localize }}</label>
        </div>

        <p>
          <label>
            <input
              v-model="type"
              class="with-gap"
              name="type"
              type="radio"
              value="income"
            />
            <span> {{ "Income" | localize }}</span>
          </label>
        </p>

        <p>
          <label>
            <input
              v-model="type"
              class="with-gap"
              name="type"
              type="radio"
              value="outcome"
            />
            <span>{{ "Outcome" | localize }}</span>
          </label>
        </p>

        <div class="input-field">
          <input
            v-model.number="amount"
            id="amount"
            type="number"
            :class="{ invalid: $v.amount.$dirty && !$v.amount.minValue }"
          />
          <label for="amount">{{ "Total" | localize }}</label>
          <span
            class="helper-text invalid"
            v-if="$v.amount.$dirty && !$v.amount.minValue"
          >
            {{ "ERROR_MinLength" | localize }}
            {{ $v.amount.$params.minValue.min }}
          </span>
        </div>

        <div class="input-field">
          <input
            v-model.trim="description"
            id="description"
            type="text"
            :class="{
              invalid: $v.description.$dirty && !$v.description.required
            }"
          />
          <label for="description">{{ "Description" | localize }}</label>
          <span
            class="helper-text invalid"
            v-if="$v.description.$dirty && !$v.description.required"
          >
            {{ "ERROR_Required" | localize }}
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
import { minValue, required } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";

export default {
  name: "Record",
  metaInfo() {
    return {
      title: this.$title("PageTitle_Record")
    };
  },
  data: () => ({
    loading: true,
    select: null,
    categories: [],
    current: null,
    type: "outcome",
    amount: "",
    description: ""
  }),
  /* Минимальное допустимое значение */
  validations: {
    description: { required },
    amount: { minValue: minValue(100) }
  },
  computed: {
    ...mapGetters(["info"]),
    canCreateRecord() {
      if (this.type === "income") {
        return true;
      } else {
        return this.info.bill >= this.amount;
      }
    }
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }

      if (this.canCreateRecord) {
        try {
          await this.$store.dispatch("createRecord", {
            categoryId: this.current,
            amount: this.amount,
            description: this.description,
            type: this.type,
            date: new Date().toJSON()
          });
          const bill =
            this.type === "income"
              ? this.info.bill + this.amount
              : this.info.bill - this.amount;

          await this.$store.dispatch("updateInfo", { bill });
          this.$message("Запись успешно создана");
          this.$v.reset();
          /*Не нравится magicNumber=1, нужно убрать*/
          this.amount = "";
          this.description = "";
          // Добавить что-то в catch
          // eslint-disable-next-line no-empty
        } catch (e) {}
      } else {
        this.$message(
          `Недостаточно средств на счёте. (Не хватает ${this.amount -
            this.info.bill} рублей)`
        );
      }
    }
  },
  async mounted() {
    this.categories = await this.$store.dispatch("fetchCategories");
    this.loading = false;
    if (this.categories.length) {
      this.current = this.categories[0].id;
    }
    setTimeout(() => {
      this.select = window.M.FormSelect.init(this.$refs.select);
      window.M.updateTextFields();
    }, 0);
  },
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy();
    }
  }
};
</script>
