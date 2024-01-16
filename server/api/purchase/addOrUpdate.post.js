import { serverSupabaseClient } from "#supabase/server";
import randomEntry from "../../randomEntry";

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event);
    const body = await readBody(event);

    //插入
    const purchaseData = [];
    let purchaseCode = body.data.purchaseCode || randomEntry("PO");
    for (const key in body.data.purchaseData) {
      if (Object.hasOwnProperty.call(body.data.purchaseData, key)) {
        const element = body.data.purchaseData[key];
        const item = {
          purchase_code: purchaseCode,
          order_code: element.orderCode,
          order_data: element.orderDetailList,
          remark:element.remark,
        };
        if (element.purchase_id) {
          item["purchase_id"] = element.purchase_id;
        }
        purchaseData.push(item);
      }
    }
    const purchaseDetailData = [];
     body.data.purchaseDetailData.map((item1) => {
      purchaseDetailData.push({
        material_code: item1.material_code,
        quantity: item1.total_quantity,
        price: item1.price_per_material,
        order_codes: item1.orderCodes,
      });
    });

    const data = await client.rpc("process_purchase_transactions", {
      purchase_data: purchaseData,
      purchase_detail_data: purchaseDetailData,
    });
    if (!data.error) {
      return { statusCode: 201, message: "操作成功" };
    } else {
      return { statusCode: data.error.code, message: data.error.message };
    }
  } catch (uncaughtError) {
    throw createError(uncaughtError);
  }
});
