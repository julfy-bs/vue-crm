<template>
  <ul class="sidenav app-sidenav" :class="{ open: value }">
    <router-link
      v-for="link in links"
      :key="link.url"
      tag="li"
      active-class="active"
      :to="link.url"
      :exact="link.exact"
    >
      <a href="#" class="waves-effect waves-orange pointer">{{ link.title }}</a>
    </router-link>
  </ul>
</template>
<script>
import localizeFilter from "@/filters/localize.filter";

export default {
  props: ["value"],
  data: () => ({
    links: [
      { title: localizeFilter("SIDEBAR-MENU_Account"), url: "/", exact: true },
      { title: localizeFilter("SIDEBAR-MENU_History"), url: "/history" },
      { title: localizeFilter("SIDEBAR-MENU_Planning"), url: "/planning" },
      { title: localizeFilter("SIDEBAR-MENU_NewRecord"), url: "/record" },
      { title: localizeFilter("SIDEBAR-MENU_Categories"), url: "/categories" }
    ]
  })
};
</script>
