<template>
  <UForm
    :state="state"
    class="space-y-2"
    ref="form"
    :validateOn="['input', 'submit']"
    @submit="onSubmit"
  >
    <UFormGroup class="mt-2" label="销售订单编号" name="orderCode">
      <UInput v-model="state.orderId" autocomplete="off" />
    </UFormGroup>
   
  </UForm>
</template>
<script setup>
const state = reactive({
  orderCode: null,
  productList: [],
});

const selLoading = ref(true);


const { data: productList } = await useLazyFetch("/api/product/all");
selLoading.value = false;
</script>
