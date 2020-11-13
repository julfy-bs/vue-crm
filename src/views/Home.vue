<template>
  <div>
    <div class="page-title">
      <h3>{{ "HomePage" | localize }}</h3>

      <button class="btn waves-effect waves-light btn-small" @click="refresh">
        <i class="material-icons">refresh</i>
      </button>
    </div>

    <Loader v-if="loading" />

    <div class="row" v-else>
      <HomeBill :rates="currency.rates" />
      <HomeCurrency :date="currency.date" :rates="currency.rates" />
    </div>
  </div>
</template>

<script>
import HomeBill from "@/components/HomeBill";
import HomeCurrency from "@/components/HomeCurrency";

export default {
  name: "Home",
  metaInfo() {
    return {
      title: this.$title("PageTitle_Home")
    };
  },
  data: () => ({
    loading: true,
    currency: null
  }),
  async mounted() {
    if (!Object.keys(this.$store.getters.info).length) {
      await this.$store.dispatch("fetchInfo");
    }
    this.currency = await this.$store.dispatch("fetchCurrency");
    this.loading = false;
  },
  methods: {
    async refresh() {
      this.loading = true;
      this.currency = await this.$store.dispatch("fetchCurrency");
      this.loading = false;
    }
  },
  components: {
    HomeBill,
    HomeCurrency
  }
};
</script>
