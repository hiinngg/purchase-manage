import { serverSupabaseClient } from "#supabase/server";

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event);
    const query = getQuery(event);
    if(!query.productCode){
        throw createError({
          statusCode: 400,
          message: '产品编码不能为空',
        })
      }
      const { data } = await client.from('bom').select('*').eq('product_code',query.productCode)
      return data

  } catch (error) {
    throw createError(uncaughtError);
  }

});
