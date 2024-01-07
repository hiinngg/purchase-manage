import { serverSupabaseClient } from "#supabase/server";

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event);
    const query = getQuery(event);
    if(!query.purchase_code){
        throw createError({
          statusCode: 400,
          message: '采购编码不能为空',
        })
      }
      const { data } = await client.from('purchase').select('*').eq('purchase_code',query.purchase_code).order('purchase_id', { ascending: true })
      return data

  } catch (error) {
    throw createError(uncaughtError);
  }
});
