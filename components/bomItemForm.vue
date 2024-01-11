<template>
  <div>
    <UForm
      :schema="schema"
      :state="state"
      class="flex items-start space-x-4 overflow-y-auto py-2"
      :validate="validate"
      ref="form"
    >
      <UFormGroup name="materialCode" class="w-1/5">
        <USelectMenu
          v-model="state.materialCode"
          searchable
          searchable-placeholder="查询物料编码"
          class="w-full"
          placeholder="选择物料编码"
          :options="props.data"
          option-attribute="material_code"
          label-attribute="material_code"
          value-attribute="material_code"
          :search-attributes="['material_code', 'material_name']"
          :popper="{ strategy: 'fixed' }"
          :uiMenu="{ width: ' w-1/4', popper: {} }"
        >
          <template #option="{ option: material }">
             <span>{{ material.material_code }}</span>;<span>{{ material.material_name }}</span>
          </template>
        </USelectMenu>
      </UFormGroup>

      <UFormGroup name="quantity" class="w-1/5">
        <UInput
          autocomplete="off"
          type="number"
          v-model="state.quantity"
          placeholder="数量"
        />
      </UFormGroup>
      <div v-if="currentItem.material_code" class="w-3/5 m-w-3/5">
        <span class="truncate">编码：{{ currentItem.material_code }}</span>
        <div class="block mt-2">名称：{{ currentItem?.material_name }}</div>
        <div class="block mt-2 text-wrap" :title="currentItem?.material_model">
          型号：{{ currentItem?.material_model }}
        </div>
        <div class="block mt-2">备注：{{ currentItem?.remark }}</div>
      </div>
    </UForm>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    default: () => [],
  },
  originalData: {
    default: () => ({}),
  },
});
const state = reactive({
  materialCode: null,
  quantity: 1,
});

const currentItem = computed(() => {
  if (state.materialCode) {
    return props.data.find((v) => v.material_code == state.materialCode) || {};
  } else {
    return {};
  }
});

const form = ref(null);
const validate = (state) => {
  const errors = [];
  if (!state.materialCode) errors.push({ path: "materialCode", message: "请输入" });
  if (!state.quantity) errors.push({ path: "quantity", message: "请输入" });
  return errors;
};

const getFormData = async () => {
  await form.value.validate("", { silent: true });
  return state;
};

watch(
  () => props.originalData,
  (data) => {
    if (data.material_code) {
      state.materialCode = data.material_code;
    }
    if (data.quantity) {
      state.quantity = data.quantity;
    }
  },
  {
    immediate: true,
  }
);

defineExpose({
  getFormData,
});

const selMaterial = ref(null);
</script>
