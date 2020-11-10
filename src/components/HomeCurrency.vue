<template>
  <div class="col s12 m6 l8">
    <div class="card orange darken-3 bill-card">
      <div class="card-content white-text">
        <div class="card-header">
          <span class="card-title">
            Курс валют
          </span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Валюта</th>
              <th>Курс</th>
              <th>Дата</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="currency in currencies" :key="currency">
              <td>{{ currency }}</td>
              <td>{{ getCurrency(currency) | currency }}</td>
              <td>{{ date | date("date") }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "HomeCurrency",
  props: ["rates", "date"],
  data: () => {
    return {
      currencies: ["USD", "EUR"]
    };
  },
  methods: {
    getCurrency(currency) {
      return this.rates["RUB"] / this.rates[currency];
    }
  },
  computed: {
    base() {
      return (
        this.$store.getters.info.bill / (this.rates["RUB"] / this.rates["EUR"])
      );
    }
  }
};
</script>
