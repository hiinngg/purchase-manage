<template>
  <UForm
    :validate="validate"
    :state="state"
    class="space-y-4 w-1/3 mt-8"
    @submit="onSubmit"
  >
    <UButton class="my-2" @click="handleClick">新增产品</UButton>
    <UFormGroup label="产品编号" name="productCode">
      <UInput v-model="state.productCode" />
    </UFormGroup>

    <UButton type="submit"> Submit </UButton>
  </UForm>

  <UModal v-model="isOpen">
    <UCard>
      <template #header> 新增产品 </template>
      <ProductForm></ProductForm>

    </UCard>
  </UModal>
  <pre>{{ data }}</pre>
</template>
<script setup>
const { data } = await useFetch('/api/product')
const isOpen = ref(false);
const state = reactive({
  productCode: undefined,
});

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



const handleClick = () => {
  isOpen.value = true;
};
</script>
