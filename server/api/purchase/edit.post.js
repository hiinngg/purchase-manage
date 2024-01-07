import { serverSupabaseClient } from "#supabase/server";

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event);
    const body = await readBody(event);
    //更新
    const arr = [];
    for (const key in body.data) {
      if (Object.hasOwnProperty.call(body.data, key)) {
        const element = body.data[key];
        const { error } = await client.from("purchase").update({
            order_data: element.orderDetailList,
            updated_at:(new Date()).toISOString()
          }).eq('purchase_id',element.purchase_id);
          if(error){
            return { statusCode: error.code, message: error.message };
          }
      }
    }
    
    return { statusCode: 201, message: "操作成功" };
  } catch (uncaughtError) {
    throw createError(uncaughtError);
  }
});
