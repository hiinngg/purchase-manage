<template>
  <UForm
    :validate="validate"
    :state="state"
    class="space-y-4 w-2/3 mt-8"
    @submit="onSubmit"
  >
    <UFormGroup label="产品编号" name="productCode">
      <USelectMenu
        v-model="state.productCode"
        :loading="selLoading"
        searchable
        searchable-placeholder="查询产品编码"
        class="w-full"
        placeholder="选择产品编码"
        :options="productList?.products"
        option-attribute="product_name"
        label-attribute="product_code"
        value-attribute="product_code"
        :search-attributes="['product_code', 'product_name']"
      >
        <template #option="{ option: product }">
          <span class="truncate"
            >编码：{{ product.product_code }}——名称：{{
              product.product_name
            }}</span
          >
        </template>
      </USelectMenu>
    </UFormGroup>

    <UFormGroup label="物料编号" name="materialCodes" class="">
      <UButton class="mb-2" @click="handleBomClick"> 添加 </UButton>
      <div class="space-y-2">
        <div
          v-for="(item, index) in bomItemList"
          :key="item.id"
          class="flex items-start w-3/5"
        >
          <BomItemForm
           ref="bomItemForms"
            :data="materialList?.materials"
            class="flex-1"
          ></BomItemForm>
          <UButton
           @click="handleDel(index)"
            class="ml-2"
            icon="i-heroicons-minus"
            size="sm"
            color="rose"
            square
            variant="solid"
          />
        </div>
      </div>
    </UFormGroup>

    <UButton @click="handleBomSave"> 保存bom </UButton>
  </UForm>

  <!--开头  BC PC DZ -->
</template>
<script setup>

const selLoading = ref(true);
const selMaterialLoading = ref(true);

const bomItemList = ref([]);
const bomItemForms = ref([])
const state = reactive({
  productCode: undefined,
  materiaCodes: [],
});
const { data: productList } = await useLazyFetch("/api/product/all");
const { data: materialList } = await useLazyFetch("/api/material/all");
selLoading.value = false;
selMaterialLoading.value = false;
const validate = (state) => {
  const errors = [];
  if (!state.productCode)
    errors.push({ path: "productCode", message: "不能为空" });
  return errors;
};

async function onSubmit(event) {
  // Do something with data
  console.log(event.data);
}

const handleBomClick = () => {
  bomItemList.value.push({id:randomEntry()});
};
const handleDel= (index)=>{
  bomItemList.value.splice(index,1)
}

const handleBomSave = async ()=>{
  const materialList = []
  for (const key in bomItemForms.value) {
    if (Object.hasOwnProperty.call(bomItemForms.value, key)) {
      const element = bomItemForms.value[key];
      const data =  await element.getFormData()
      materialList.push(data)
      
    }
  }
}
</script>
