<template>
  Hi,欢迎来到采购管理系统~
  <div>
    <input type="file" @change="handleFileUpload" />
    <UButton @click="handleAdd" :loading="submitLoading">批量导入</UButton>
    <pre>{{ jsonOutput }}</pre>
  </div>
</template>
<script setup>
import * as XLSX from "xlsx";

const toast = useToast();
const jsonOutput = ref(null);
const submitLoading = ref(false);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const data = e.target.result;
    const workbook = XLSX.read(data, { type: "binary" });
    const firstSheetName = workbook.SheetNames[4];
    const worksheet = workbook.Sheets[firstSheetName];

    // 处理合并单元格的逻辑
    handleMergedCells(worksheet);

    // 转换为 JSON
    jsonOutput.value = processData(XLSX.utils.sheet_to_json(worksheet));
  };

  reader.readAsBinaryString(file);
};

const handleMergedCells = (sheet) => {
  if (sheet["!merges"]) {
    sheet["!merges"].forEach((merge) => {
      // 获取合并区域的左上角单元格的值
      const topLeftCellRef = XLSX.utils.encode_cell({ c: merge.s.c, r: merge.s.r });
      const topLeftCellValue = sheet[topLeftCellRef].v;

      // 将这个值复制到整个合并区域的单元格
      for (let r = merge.s.r; r <= merge.e.r; ++r) {
        for (let c = merge.s.c; c <= merge.e.c; ++c) {
          const cellRef = XLSX.utils.encode_cell({ c, r });
          sheet[cellRef] = { v: topLeftCellValue, t: "s" };
        }
      }
    });
  }
};
const handleAdd = async () => {
  // console.log(event.data);
  submitLoading.value = true;

  try {
    const { data, error, status } = await useFetch("/api/product/batchAdd", {
      method: "post",
      body: jsonOutput,
      watch: false,
    });
    if (data.value.statusCode == "201") {
      // productStore.$reset();
      toast.add({ title: "操作成功" });
      emits("operSuccess");
    } else {
      toast.add({
        title: data.value.message,
        color: "rose",
        icon: "i-ep-circle-close",
      });
      if (data.value.statusCode == 1001) {
        // form.value.setErrors(
        //   [{ message: data.value.message, path: "productCode" }],
        //   "materialCode"
        // );
      }
    }
  
  } catch (error) {
    console.log(error, "errorr");
    // if (error.statusCode==400){
    //   form.value.setErrors({path:'materialCode',message:data.value.message})
    // }
  }
  submitLoading.value = false
};
const processData = (data) => {
  const res = [];
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const element = data[key];
      if (element.product_code&&(element.product_code == element.code)) {
        const item = { productInfo: {}, materialList: [] };

        item.productInfo = {
          productCode: element.code,
          productName: element.name,
          // productModel: element.model,
          productColortemperature: element.model2 || element.model3,
          productWattage: element.model,
        };

        //物料
        const materialList = data.filter((v) => {
          return v.code&&v.product_code == element.product_code && v.code != element.product_code;
        });
        materialList.map((v1) => {
          item.materialList.push({
            materialCode: v1.code,
            materialName: v1.name,
            materialModel: v1.model,
            quantity:1,
            remark:v1.model2
          });
        });

        res.push(item);
      }
    }
  }
  return res;
};
</script>
