<template>
  <UForm
    :validate="validate"
    :state="state"
    class=""
    ref="form"
    :validateOn="['input', 'submit']"
    @submit="onSubmit"
  >
    <UFormGroup class="mt-2" label="产品编号" name="productCode">
      <UInput :disabled="props.originalData.product_id" v-model="state.productCode" autocomplete="off" />
    </UFormGroup>
    <UFormGroup class="mt-2" label="产品名称" name="productName">
      <UInput v-model="state.productName" autocomplete="off" />
    </UFormGroup>
    <UFormGroup class="mt-2" label="产品型号" name="productModel">
      <UInput v-model="state.productModel" autocomplete="off" />
    </UFormGroup>
    <UFormGroup class="mt-2" label="色温" name="productColortemperature">
      <UInput v-model="state.productColortemperature" autocomplete="off" />
    </UFormGroup>
    <UFormGroup class="mt-2" label="瓦数" name="productWattage">
      <UInput v-model="state.productWattage" autocomplete="off" />
    </UFormGroup>

    <!-- <UButton type="submit" class="mt-4" :loading="submitLoading"> 保存 </UButton> -->
  </UForm>
</template>

<script setup>
const props = defineProps({
  originalData: {
    default: () => ({}),
  },
});

const state = reactive({
  productCode: undefined,
  productName: undefined,
  productModel: undefined,
  productColortemperature: undefined,
  productWattage: undefined,
});

const form = ref(null);
const emits = defineEmits(["operSuccess"]);
// const submitLoading = ref(false)
// const toast = useToast()
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

const getFormData = async (event) => {
  await form.value.validate();
  return state;
  // Do something with data
  // form.value.clear()
  // console.log(event.data);
  // submitLoading.value = true

  //  try {
  //   const {data,error,status} = await useFetch('/api/product/add',{
  //     method:'post',
  //     body:event.data,
  //     watch:false,
  //   })
  //   if(status.value=='success'){
  //     const productStore = useProductStore()
  //     productStore.$reset()
  //     toast.add({title:'操作成功'})
  //     emits('operSuccess')

  //   }else{
  //     toast.add({title:error.value.data.message,color:'rose','icon':'i-ep-circle-close'})
  //     if(error.value.data.data.errorCode==1001){
  //       form.value.setErrors([{message:error.value.data.message,path:'productCode'}],'productCode')
  //     }
  //   }
  //  } catch (error) {
  //   console.log(error,'errorr')
  // if (error.statusCode==400){
  //   form.value.setErrors({path:'productCode',message:data.value.message})
  // }
  //}

  // submitLoading.value = false

  //
};

watch(
  () => props.originalData,
  (data) => {
    nextTick(() => {
      (state.productCode = data.product_code),
        (state.productName = data.product_name),
        (state.productModel = data.product_model),
        (state.productColortemperature = data.product_colortemperature),
        (state.productWattage = data.product_wattage);
    });
  },{
    immediate:true
  }
);

defineExpose({
  getFormData,
});
</script>
