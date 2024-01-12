<template>
  <UForm
    :state="state"
    class="space-y-2"
    ref="form"
    :validate="validate"
    @submit="onSubmit"
  >
    <UFormGroup class="mt-2 w-3/5" label="销售订单编号" name="orderCode">
      <UInput
        size="xl"
        :disabled="props.originalData.purchase_id"
        v-model="state.orderCode"
        autocomplete="off"
      />
    </UFormGroup>
    <UFormGroup class="mt-2 w-3/5" label="备注" name="remark">
      <UInput
        v-model="state.remark"
        autocomplete="off"
      />
    </UFormGroup>
    <UFormGroup class="mt-2" label="订单明细" name="products">
      <UButton @click="addOrderDetail">增加订单明细</UButton>
      <template v-for="(item, index) in orderDetailList" :key="item.id">
        <div class="flex mt-2 items-start" >
          <OrderItemFrom :originalData="item" ref="orderItem" class="w-full"  />
          <UButton
            @click="handleDel(index)"
            :padded="false"
            class="ml-2"
            color="red"
            icon="i-heroicons-minus"
          />

     
       
        </div>
      </template>
    </UFormGroup>
  </UForm>
</template>
<script setup>
const props = defineProps({
  originalData: {
    default: null,
  },
});

const emits = defineEmits(["error"]);
const state = reactive({
  orderCode: null,
  remark:"",
  productCodeList: [],
});

const orderDetailList = ref([]);

if (props.originalData.order_code) {
  state.orderCode = props.originalData.order_code;
  state.remark = props.originalData.remark;
  if (Array.isArray(props.originalData.order_data)) {
    props.originalData.order_data.map((item) => {
      nextTick(() => {
        orderDetailList.value.push({ id: randomEntry(), ...item });
      });
    });
  }
}

const form = ref(null);
const orderItem = ref([]);
const selLoading = ref(true);

selLoading.value = false;

const handleDel = (index) => {
  orderDetailList.value.splice(index, 1);
};

const addOrderDetail = () => {
  orderDetailList.value.push({ id: randomEntry() });
};

const validate = async (state) => {
  const errors = [];
  if (!state.orderCode)
    errors.push({
      path: "orderCode",
      message: "请输入订单编号",
      id: "orderCode",
    });
  return errors;
};

const getFormData = async () => {
  try {
    await form.value.validate();
    const dataList = [];
    for (const key in orderItem.value) {
      if (Object.hasOwnProperty.call(orderItem.value, key)) {
        const element = orderItem.value[key];

        const data = await element.geSubFormData();
        state.productCodeList.push(data.productCode);

        const item = { ...data, orderCode: state.orderCode };

        dataList.push(item);
      }
    }

    state.orderDetailList = dataList;
    if (props.originalData.purchase_id) {
      state.purchase_id = props.originalData.purchase_id;
    }
    return state;
  } catch (error) {
    emits("error");
    throw new Error(error);
  }
};

defineExpose({
  getFormData,
});
</script>
