import { serverSupabaseClient } from "#supabase/server";

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event);
    const query = getQuery(event);
    if(!query.product_id){
        throw createError({
          statusCode: 400,
          message: '产品id不能为空',
        })
      }
      const { data } = await client.from('product').select('*,bom(*)').eq('product_id',query.product_id).single()
      return data

  } catch (error) {
    throw createError(uncaughtError);
  }
});
