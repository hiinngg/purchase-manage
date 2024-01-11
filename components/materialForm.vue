<template>
  <UForm
    :validate="validate"
    :state="state"
    class=""
    ref="form"
    :validateOn="['input', 'submit']"
    @submit="onSubmit"
  >
    <UFormGroup class="mt-2" label="物料编号" name="materialCode">
      <UInput  :disabled="props.originalData.material_id" v-model="state.materialCode" autocomplete="off" />
    </UFormGroup>
    <UFormGroup class="mt-2" label="物料名称" name="materialName">
      <UInput v-model="state.materialName" autocomplete="off" />
    </UFormGroup>
    <UFormGroup class="mt-2" label="物料型号" name="materialModel">
      <UInput v-model="state.materialModel" autocomplete="off" />
    </UFormGroup>
    <UFormGroup class="mt-2" label="备注" name="remark">
      <UInput v-model="state.remark" autocomplete="off" />
    </UFormGroup>

    <UButton type="submit" class="mt-4" :loading="submitLoading"> 保存 </UButton>
  </UForm>
</template>

<script setup>
const props = defineProps({
  originalData: {
    default: () => ({}),
  },
});

const state = reactive({
  materialCode: undefined,
  materialName: undefined,
  materialModel: undefined,
  remark: undefined,
});

const form = ref();
const emits = defineEmits(["operSuccess"]);
const submitLoading = ref(false);
const toast = useToast();
const validate = (state) => {
  const errors = [];
  if (!state.materialCode) errors.push({ path: "materialCode", message: "不能为空" });
  if (!state.materialName) errors.push({ path: "materialName", message: "不能为空" });
  if (!state.materialModel) errors.push({ path: "materialModel", message: "不能为空" });
  return errors;
};

async function onSubmit(event) {
  // Do something with data
  form.value.clear();
  console.log(event.data);
  submitLoading.value = true;
  const postData = event.data
  let url  = "/api/material/add"
  if(props.originalData.material_id){
     url = "/api/material/edit",
     postData.material_id = props.originalData.material_id
  }
 
  try {
    const { data, error, status } = await useFetch(url, {
      method: "post",
      body: event.data,
      watch: false,
    });
    if (status.value == "success") {
      toast.add({ title: "操作成功" });
      emits("operSuccess");
    } else {
      toast.add({
        title: error.value.data.message,
        color: "rose",
        icon: "i-ep-circle-close",
      });
      if (error.value.data.data.errorCode == 1001) {
        form.value.setErrors(
          [{ message: error.value.data.message, path: "materialCode" }],
          "materialCode"
        );
      }
    }
  } catch (error) {
    console.log(error, "errorr");
    // if (error.statusCode==400){
    //   form.value.setErrors({path:'materialCode',message:data.value.message})
    // }
  }

  submitLoading.value = false;

  //
}

watch(
  () => props.originalData,
  (data) => {
    nextTick(() => {
      state.materialCode = data.material_code;
      state.materialName = data.material_name;
      state.materialModel = data.material_model;
      state.remark = data.remark
    });
  },
  {
    immediate: true,
  }
);
</script>
