<template>
  <div class="app-page">
    <div class="page-title">
      <h3>{{ "RecordsHistory" | localize }}</h3>
    </div>

    <div class="history-chart">
      <canvas ref="canvas"></canvas>
    </div>

    <Loader v-if="loading" />
    <p class="center" v-else-if="!records.length">
      {{ "EMPTY_NoRecords" | localize }}
      <router-link to="/record">
        {{ "EMPTY_AddRecord" | localize }}
      </router-link>
    </p>
    <section v-else>
      <HistoryTable :page="page" :page-size="pageSize" :records="items" />
      <Paginate
        :key="locale"
        v-model="page"
        :pageCount="pageCount"
        :clickHandler="pageChangeHandler"
        :prevText="movePrev"
        :nextText="moveNext"
        :containerClass="'pagination center'"
        :page-class="'waves-effect'"
      >
      </Paginate>
    </section>
  </div>
</template>
<script>
import paginationMixin from "@/mixins/pagination.mixin";
import HistoryTable from "@/components/HistoryTable";
import { Pie } from "vue-chartjs";
import localizeFilter from "@/filters/localize.filter";

export default {
  name: "History",
  metaInfo() {
    return {
      title: this.$title("PageTitle_History")
    };
  },
  extends: Pie,
  mixins: [paginationMixin],
  data: () => ({
    loading: true,
    records: [],
    movePrev: localizeFilter("BUTTON_Previous"),
    moveNext: localizeFilter("BUTTON_Next")
  }),
  components: {
    HistoryTable
  },
  watch: {
    $route(to) {
      if (!to.query.page) {
        this.pageChangeHandler(1);
        this.page = 1;
      }
    },
    locale() {
      return this.$store.getters.info.locale;
    }
  },
  computed: {
    locale() {
      return this.$store.getters.info.locale;
    }
  },
  methods: {
    setup(categories) {
      this.setupPagination(
        (this.records = this.records.map(record => {
          return {
            ...record,
            categoryName: categories.find(c => c.id === record.categoryId)
              .title,
            typeClass: record.type === "income" ? "green" : "red",
            typeText:
              record.type === "income"
                ? localizeFilter("Income")
                : localizeFilter("Outcome")
          };
        }))
      );
      this.renderChart({
        labels: categories.map(c => c.title),
        datasets: [
          {
            label: "Расходы по категориям",
            data: categories.map(c => {
              return this.records.reduce((total, r) => {
                if (r.categoryId === c.id && r.type === "outcome") {
                  total += +r.amount;
                }
                return total;
              }, 0);
            }),
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)"
            ],
            borderWidth: 1
          }
        ]
      });
    }
  },
  async mounted() {
    this.records = await this.$store.dispatch("fetchRecords");
    const categories = await this.$store.dispatch("fetchCategories");
    this.setup(categories);

    this.loading = false;
  }
};
</script>
