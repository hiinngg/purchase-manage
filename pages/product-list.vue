<template>
     <UButton class="my-8" @click="handleClick">新增产品</UButton>
    <UButton class="my-8 ml-2" @click="handleMaterialClick">新增物料</UButton>
    <UButton class="my-8 ml-2" @click="handleBomClick">新增bom</UButton>
   <!-- <UTable
   :loading="false"
  :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }"
  class="w-full px-8"
  :columns="[{ key: 'product_code', label: '产品编码' }, { key: 'product_name', label: '产品名称' }, { key: 'product_model', label: '产品型号' }]"
/> -->
<UModal v-model="isOpen">
    <UCard>
      <template #header> 新增产品 </template>
      <ProductForm @operSuccess="isOpen = false"></ProductForm>
    </UCard>
  </UModal>
  <UModal v-model="isMaterialFormOpen">
    <UCard>
      <template #header> 新增物料 </template>
      <MaterialForm @operSuccess="isMaterialFormOpen = false"></MaterialForm>
    </UCard>
  </UModal>

  <UModal v-model="isbomFormOpen">
    <UCard>
      <template #header> 新增BOM</template>
      <BomForm @operSuccess="isbomFormOpen = false"></BomForm>
    </UCard>
  </UModal>
</template>
<script setup>

const isOpen = ref(false);
const isMaterialFormOpen = ref(false);
const isbomFormOpen = ref(false);
const handleClick = () => {
  isOpen.value = true;
};
const handleMaterialClick = () => {
  isMaterialFormOpen.value = true;
};
const handleBomClick = () => {
  isbomFormOpen.value = true;
};


</script>
<style lang="scss">
</style>