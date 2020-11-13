<template>
  <div class="app-page">
    <div>
      <div class="page-title">
        <h3>{{ "Planning" | localize }}</h3>
        <h4>{{ info.bill | currency("RUB") }}</h4>
      </div>

      <Loader v-if="loading" />

      <p class="center" v-else-if="!categories.length">
        {{ "EMPTY_NoCategories" | localize }}
        <router-link to="/categories">
          {{ "EMPTY_AddCategory" | localize }}
        </router-link>
      </p>

      <section v-else>
        <div v-for="cat in categories" :key="cat.id">
          <p>
            <strong>{{ cat.title }}:</strong>
            {{ cat.spend | currency("RUB") }} из
            {{ cat.limit | currency("RUB") }}
          </p>
          <div class="progress" v-tooltip="cat.tooltip">
            <div
              class="determinate"
              :class="[cat.progressColor]"
              :style="{ width: cat.progressPercent + '%' }"
            ></div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import currencyFilter from "@/filters/currency.filter";
import localizeFilter from "@/filters/localize.filter";

export default {
  name: "Planning",
  metaInfo() {
    return {
      title: this.$title("PageTitle_Planning")
    };
  },
  data: () => ({
    loading: true,
    categories: []
  }),
  computed: {
    ...mapGetters(["info"])
  },
  async mounted() {
    const records = await this.$store.dispatch("fetchRecords");
    const categories = await this.$store.dispatch("fetchCategories");

    this.categories = categories.map(cat => {
      const spend = records
        .filter(r => r.categoryId === cat.id)
        .filter(r => r.type === "outcome")
        .reduce((total, record) => {
          return (total += +record.amount);
        }, 0);

      const percent = (100 * spend) / cat.limit;
      const progressPercent = percent > 100 ? 100 : percent;
      const progressColor =
        percent < 60 ? "green" : percent < 100 ? "yellow" : "red";

      const tooltipValue = cat.limit - spend;
      const tooltip = `${
        tooltipValue < 0
          ? localizeFilter("TOOLTIP_Increase")
          : localizeFilter("TOOLTIP_Left")
      } ${currencyFilter(Math.abs(tooltipValue))}`;

      return {
        ...cat,
        progressPercent,
        progressColor,
        spend,
        tooltip
      };
    });

    this.loading = false;
  }
};
</script>
