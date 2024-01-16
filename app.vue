<template>
  <!-- <UHeader title="采购管理系统" /> -->
  <!-- <UPage>
      <template #left>
        <UAside  class="aside">
          <UNavigationTree :links="links" default-open :multiple="false" />
        </UAside>
      </template>
 
   
    </UPage> -->

  <div class="max-h-screen h-screen">
    <div
      class="py-4 pl-12 font-bold inline-block align-middle"
      style="height: 60px; box-sizing: border-box"
    >
      <h2>采购管理系统</h2>
    </div>
    <div class="flex w-100%" style="height: calc(100% - 60px)">
      <div class="w-1/6">
        <UVerticalNavigation :links="links" :ui="{ width: 'w-auto' }" />
      </div>
      <div class="flex-1 h-full"><NuxtLoadingIndicator /><NuxtPage /></div>
    </div>

    <UNotifications />
  </div>
  <!-- <UFooter /> -->
</template>
<script setup>
const links = [
  {
    label: "物料管理",
    class: "ml-8",
    to: "/material/list",
  },
  {
    label: "产品bom管理",
    class: "ml-8",
    to: "/product-list",
  },
  {
    label: "采购管理",
    class: "ml-8",
    to: "/purchase/list",
  },
];
</script>
<style>
.aside {
}
</style>
