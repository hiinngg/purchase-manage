import { serverSupabaseClient } from "#supabase/server";

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event);
    const body = await readBody(event)
    if (!Array.isArray(body.materialCodes)) {
      throw createError({
        statusCode: 400,
        message: "物料编码不能为空",
      });
    }
    const res = await client
      .rpc('get_material_details',{material_codes:body.materialCodes})
      console.log(res,'get_material_details')
    return res.data;
  } catch (error) {
    throw createError(uncaughtError);
  }
});
