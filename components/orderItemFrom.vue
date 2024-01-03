<template>
  <UForm
    :state="state"
    class="space-y-2"
    ref="form"
    :validateOn="['input', 'submit']"
  >
    <div class="flex">
      <UFormGroup  name="productCode" class="w-2/3">
        <USelectMenu
          v-model="state.productCode"
          :loading="selLoading"
          searchable
          searchable-placeholder="查询产品编码"
          class="w-full"
          placeholder="选择产品编码"
          :options="productOriginalList"
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

      <UFormGroup name="quantity" class="w-1/3 ml-2">
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
  productCode:null,
  quantity:1
});

const form = ref(null)

const selLoading = ref(true);
const productStore = useProductStore()
const productOriginalList = await productStore.fetchProduct();
toRef(productOriginalList)
selLoading.value = false;


const getFormData = async ()=>{
   await form.value.validate('',{silent:true })
   return state;
}

defineExpose({
    getFormData
})




</script>