import supabase from "../../../operation/superbase"
import { emptyNumber, emptyString, invalidEmail } from "../../../operation/validation"

export default async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            return await get(req, res)
        case 'POST':
            return await create(req, res)
        default:
            bad(res, 404, 'Page not found')
    }
}

const good = (res, code, data, message) => {
    return res.status(code).json({ status: true, data, message })
}
const bad = (res, code, message) => {
    return res.status(code).json({ status: !true, message })

}



const create = async (req, res) => {
    try {
        const data = req.body
        const { asset_id, inventory_id } = data
        if (emptyString(asset_id)) bad(res, 400, 'asset_id is requires!')
        if (emptyString(inventory_id)) bad(res, 400, 'inventory_id is requires!')


        //db call for asset_id
        const assetData = await supabase
            .from('asset')
            .select('*')
            .eq('isDelete', false)
            .eq('id', asset_id)
        if (!assetData.data || assetData.data.length == 0 || assetData.error) return bad(res, 404, assetData.error?.message || 'asset id does\'t avalable!')



        //db call for order_id
        const invData = await supabase
            .from('inventory')
            .select('*')
            .eq('isDelete', false)
            .eq('id', inventory_id)
        if (!invData.data || invData.data.length == 0 || invData.error) return bad(res, 404, invData.error?.message || 'inventory id does\'t avalable!')





        const { createData, error } = await supabase
            .from('flyer')
            .insert([{ asset_id, inventory_id }]);

        if (error) return bad(res, 400, error.message)

        return good(res, 201, createData, 'flyer created successfully!')
    } catch (e) {
        bad(res, 500, e.message)
    }
}




const get = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('flyer')
            .select('id,created_at,asset_id,inventory_id')
            .eq('isDelete', false);

        if (error) return bad(res, 400, error.message)
        if (get.length == 0) return bad(res, 404, 'No flyer list avalable!')

        return good(res, 200, data, 'flyer list!')
    } catch (e) {
        bad(res, 500, e.message)
    }
}