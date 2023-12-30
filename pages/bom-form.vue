<template>
  <UForm
    :validate="validate"
    :state="state"
    class="space-y-4 w-2/3 mt-8"
    @submit="onSubmit"
  >
    <UButton class="my-2" @click="handleClick">新增产品</UButton>
    <UButton class="ml-2" @click="handleMaterialClick">新增物料</UButton>
    <UFormGroup label="产品编号" name="productCode">
      <USelectMenu
        v-model="state.productCode"
        :loading="selLoading"
        searchable
        searchable-placeholder="查询产品编码"
        class="w-full"
        placeholder="选择产品编码"
        :options="productList.products"
        option-attribute="product_name"
        label-attribute="product_code"
        value-attribute="product_code"
        :search-attributes="['product_code', 'product_name']"
      >
        <template #option="{ option: product }">
          <span class="truncate"
            >编码：{{ product.product_code }}——名称：{{ product.product_name }}</span
          >
        </template>
      </USelectMenu>
    </UFormGroup>

    <UFormGroup label="物料编号" name="materialCodes">
      <USelectMenu
        v-model="state.materiaCodes"
        :loading="selMaterialLoading"
        searchable
        multiple
        searchable-placeholder="查询物料编码"
        class="w-full"
        placeholder="选择物料编码"
        :options="materialList.materials"
        option-attribute="material_name"
        label-attribute="material_code"
        value-attribute="material_code"
        :search-attributes="['material_code', 'material_name']"
      >
        <template #option="{ option: material }">
          <span class="truncate"
            >编码：{{ material.material_code }}——名称：{{ material.material_name }}</span
          >
        </template>
      </USelectMenu>
    </UFormGroup>

    <UButton type="submit"> 保存bom </UButton>
  </UForm>

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
  <pre>{{ data }}</pre>
</template>
<script setup>
const isOpen = ref(false);
const isMaterialFormOpen = ref(false);
const selLoading = ref(true);
const selMaterialLoading = ref(true);
const state = reactive({
  productCode: undefined,
  materiaCodes:[]
});
const { data: productList } = await useLazyFetch("/api/product/all");
const { data: materialList } = await useLazyFetch("/api/material/all");
selLoading.value = false;
selMaterialLoading.value = false
const validate = (state) => {
  const errors = [];
  if (!state.productCode) errors.push({ path: "productCode", message: "不能为空" });
  return errors;
};

async function onSubmit(event) {
  // Do something with data
  console.log(event.data);
}

const handleClick = () => {
  isOpen.value = true;
};
const handleMaterialClick = ()=>{
  isMaterialFormOpen.value = true;
}
</script>
