<template>
  <UButton class="my-8">新增产品bom</UButton>
   <UTable
   :loading="false"
  :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }"
  class="w-full px-8"
  :columns="[{ key: 'product_code', label: '产品编码' }, { key: 'product_name', label: '产品名称' }, { key: 'product_model', label: '产品型号' }]"
/>
</template>

<style lang="scss">
</style>