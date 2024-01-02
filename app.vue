<template>
  <!-- <UHeader title="采购管理系统" /> -->
  <!-- <UPage>
      <template #left>
        <UAside  class="aside">
          <UNavigationTree :links="links" default-open :multiple="false" />
        </UAside>
      </template>
 
   
    </UPage> -->
  <div class="my-4 ml-12 font-bold inline-block align-middle">
    <h2>采购管理系统</h2>
  </div>
  <div class="flex w-100% ">
    <div class="w-1/6 ">
      <UVerticalNavigation :links="links" :ui="{width:'w-auto'}" />
    </div>
    <div class="flex-1"><NuxtPage /></div>
  </div>

  <UNotifications />
  <!-- <UFooter /> -->
</template>
<script setup>
const links = [
  // {
  //   label: "新增bom",
  //   class: "ml-8",
  //   to: "/bom-form",
  // },
  {
    label: "产品bom管理",
    class: "ml-8",
    to: "/product-list",
  },
  {
    label: "采购管理",
    class: "ml-8",
    to: "/purchase",
  },
];
</script>
<style>
.aside {
}
</style>
