import { serverSupabaseClient } from "#supabase/server";

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event);
    const body = await readBody(event);
    //更新
    const { error } = await client.from("material").update({
        "material_name":body.materialName,
        "material_model":body.materialModel,
        "remark":body.remark
      }).eq('material_id',body.material_id);
      if(error){
        return { statusCode: error.code, message: error.message };
      }
    return { statusCode: 201, message: "操作成功" };
  } catch (uncaughtError) {
    throw createError(uncaughtError);
  }
});
