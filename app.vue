<template>
  <UHeader title="采购管理系统" />
  <UPage>
      <template #left>
        <UAside  class="aside">
          <UNavigationTree :links="links" default-open :multiple="false" />
        </UAside>
      </template>
 
      <slot />
    </UPage>
  <UFooter />
</template>
<script setup>
const links = [{
  label: 'bom管理',
  class:'ml-8',
  to: '/bom-list'
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