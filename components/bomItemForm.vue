<template>
 <UForm :schema="schema" :state="state" class="flex items-start space-x-4" :validate="validate"  ref="form">
    <UFormGroup  name="materialCode" class="w-2/3">
          <USelectMenu
          v-model="state.materialCode"
        searchable
        searchable-placeholder="查询物料编码"
        class="w-full"
        placeholder="选择物料编码"
        :options="props.data"
        option-attribute="material_name"
        label-attribute="material_code"
        value-attribute="material_code"
        :search-attributes="['material_code', 'material_name']"
      >
        <template #option="{ option: material }">
          <span class="truncate"
            >编码：{{ material.material_code }}——名称：{{ material.material_name }}</span
          >
        </template>
      </USelectMenu>
    </UFormGroup>

    <UFormGroup  name="quantity" class="w-1/3" >
        <UInput autocomplete="off" type="number" v-model="state.quantity"   placeholder="数量" />
    </UFormGroup>

  </UForm>
</template>
<script setup>
const props = defineProps({
    data:{
        default:()=>[],
    },
    originalData:{
      default:()=>({}),
    }
})
const state = reactive({
     materialCode:null,
     quantity:1
});

const form = ref(null)
const validate = (state) => {
  const errors = []
  if (!state.materialCode) errors.push({ path: 'materialCode', message: '请输入' })
  if (!state.quantity) errors.push({ path: 'quantity', message: '请输入' })
  return errors
}

const getFormData = async ()=>{
   await form.value.validate('',{silent:true })
   return state;
}

watch(()=>props.originalData,(data)=>{
  if(data.material_code){
    state.materialCode = data.material_code
  }
  if(data.quantity){
    state.quantity = data.quantity
  }
},{
  immediate:true
})

defineExpose({
    getFormData
})

const selMaterial = ref(null)
</script>