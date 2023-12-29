<template>
  <UHeader title="采购管理系统" />
  <UPage>
      <template #left>
        <UAside  class="aside">
          <UNavigationTree :links="links" default-open :multiple="false" />
        </UAside>
      </template>
 
      <NuxtPage />
    </UPage>
  <UFooter />
</template>
<script setup>
const links = [{
  label: '产品bom管理',
  class:'ml-8',
  to: '/product-list'
}, {
  label: '采购管理',
  class:'ml-8',
  to: '/purchase'
}]

</script>
<style>
.aside{
}
</style>