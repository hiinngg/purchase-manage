<template>
  <UForm
    :validate="validate"
    :state="state"
    class=""
    @submit="onSubmit"
  >
    <UFormGroup class="mt-2" label="产品编号" name="productCode">
      <UInput v-model="state.productCode" />
    </UFormGroup>
    <UFormGroup class="mt-2" label="产品名称" name="productName">
      <UInput v-model="state.productName" />
    </UFormGroup>
    <UFormGroup class="mt-2" label="产品型号" name="productModel">
      <UInput v-model="state.productModel" />
    </UFormGroup>
    <UFormGroup class="mt-2" label="色温" name="productColortemperature">
      <UInput v-model="state.productColortemperature" />
    </UFormGroup>
    <UFormGroup class="mt-2" label="瓦数" name="productWattage">
      <UInput v-model="state.productWattage" />
    </UFormGroup>

    <UButton type="submit" class="mt-4" > Submit </UButton>
  </UForm>
</template>

<script setup>
const state = reactive({
  productCode: undefined,
  productName: undefined,
  productModel: undefined,
  productColortemperature:undefined,
  productWattage:undefined
});

const validate = (state) => {
  const errors = [];
  if (!state.productCode)
    errors.push({ path: "productCode", message: "不能为空" });
    if (!state.productName)
    errors.push({ path: "productName", message: "不能为空" });
    if (!state.productModel)
    errors.push({ path: "productModel", message: "不能为空" });
    if (!state.productColortemperature)
    errors.push({ path: "productColortemperature", message: "不能为空" });
    if (!state.productWattage)
    errors.push({ path: "productWattage", message: "不能为空" });
  return errors;
};

async function onSubmit(event) {
  // Do something with data
  console.log(event.data);
}
</script>