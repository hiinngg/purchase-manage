import { serverSupabaseClient } from "#supabase/server";

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event);
    const body = await readBody(event);

    //插入
    const arr = body.data.map((item) => {
      return {
        material_code: item.material_code,
        quantity: item.total_quantity,
        price: item.price_per_material,
        order_codes:item.orderCodes,
      };
    });
    const { error } = await client.from("purchase_detail").insert(arr);
    if (!error) {
      return { statusCode: 201, message: "操作成功" };
    } else {
      return { statusCode: error.code, message: error.message };
    }
  } catch (uncaughtError) {
    throw createError(uncaughtError);
  }
});
