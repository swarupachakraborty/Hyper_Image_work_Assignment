import supabase from "../../../operation/superbase"
import { emptyNumber, emptyObject, emptyString, invalidEmail } from "../../../operation/validation"

export default async function handler(req, res) {
    switch (req.method) {
        case 'PUT':
            return await update(req, res)
        case 'DELETE':
            return await deleteUser(req, res)
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

const update = async (req, res) => {
    try {
        const flyerId = req.query.flyerId || null
        if (emptyString(flyerId)) return bad(res, 400, 'flyerId is required!')

        const body = req.body
        const { asset_id, inventory_id } = body
        const object = {}

        if (!emptyString(inventory_id)) {
            //db call for order_id
            const invData = await supabase
                .from('inventory')
                .select('*')
                .eq('isDelete', false)
                .eq('id', inventory_id)
            if (!invData.data || invData.data.length == 0 || invData.error) return bad(res, 404, invData.error?.message || 'inventory id does\'t avalable!')

            object.inventory_id = inventory_id
        }
        if (!emptyString(asset_id)) {
            //db call for asset_id
            const orderData = await supabase
                .from('asset')
                .select('*')
                .eq('isDelete', false)
                .eq('id', asset_id)
            if (!orderData.data || orderData.data.length == 0 || orderData.error) return bad(res, 404, orderData.error?.message || 'order id does\'t avalable!')

            object.asset_id = asset_id
        }



        const updateTBL = await supabase
            .from('flyer')
            .update(object)
            .eq('isDelete', false)
            .eq('id', flyerId)
            .select('id,inventory_id,asset_id')

        if (updateTBL.error) return bad(res, 400, updateTBL.error.message || 'flyer info unavalable')

        return good(res, 200, updateTBL.data[0], 'flyer updated successfully!')

    } catch (e) {
        bad(res, 500, e.message)
    }
}

const deleteUser = async (req, res) => {
    try {
        const flyerId = req.query.flyerId || null
        if (emptyString(flyerId)) return bad(res, 400, 'flyerId is required!')

        const { data, error } = await supabase
            .from('flyer')
            .update({ 'isDelete': true })
            .eq('isDelete', false)
            .eq('id', flyerId)
            .select('id')

        if (error && error.message) return bad(res, 400, error.message)
        if (!data) return bad(res, 404, 'flyer info unavalable!')

        return good(res, 200, undefined, 'flyer deleted successfully!')
    } catch (e) {
        bad(res, 500, e.message)
    }
}