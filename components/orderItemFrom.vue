<template>
  <UForm
    :state="state"
    class="space-y-2"
    ref="form"
    :validateOn="['input', 'submit']"
    @submit="onSubmit"
  >
    <div>
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

      <UFormGroup name="quantity" class="w-1/3">
        <UInput
          autocomplete="off"
          type="number"
          v-model="state.quantity"
          placeholder="数量"
        />
      </UFormGroup>
    </div>
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