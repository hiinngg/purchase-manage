import { serverSupabaseClient } from "#supabase/server";

const p_page_size = 10;

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event);
    const query = getQuery(event);
    let data = []
    if (query.orderCode) {
     data = await client.rpc("get_purchase_data_byordercode", {
        p_page_num: query.page_num,
        p_page_size,
        p_order_code: query.orderCode,
      });
    } else {
      data = await client.rpc("get_purchase_data", {
        p_page_num: query.page_num,
        p_page_size,
      });
    }

    console.log(data.data,data);
    return data.data;
  } catch (uncaughtError) {
    console.log(uncaughtError);
    throw createError(uncaughtError);
  }
});
