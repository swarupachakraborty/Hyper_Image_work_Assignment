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
        const itemId = req.query.itemId || null
        if (emptyString(itemId)) return bad(res, 400, 'itemId is required!')

        const body = req.body
        const { inventory_id, order_id, quantity } = body
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
        if (!emptyString(order_id)) {
            //db call for order_id
            const orderData = await supabase
                .from('order')
                .select('*')
                .eq('isDelete', false)
                .eq('id', order_id)
            if (!orderData.data || orderData.data.length == 0 || orderData.error) return bad(res, 404, orderData.error?.message || 'order id does\'t avalable!')

            object.order_id = order_id
        }
        if (!emptyNumber(quantity)) {
            object.quantity = quantity
        }


        const updateTBL = await supabase
            .from('order_item')
            .update(object)
            .eq('isDelete', false)
            .eq('id', itemId)
            .select('id,inventory_id,order_id,quantity')

        if (updateTBL.error) return bad(res, 400, updateTBL.error.message || 'order_item info unavalable')

        return good(res, 200, updateTBL.data[0], 'order_item updated successfully!')

    } catch (e) {
        bad(res, 500, e.message)
    }
}

const deleteUser = async (req, res) => {
    try {
        const itemId = req.query.itemId || null
        if (emptyString(itemId)) return bad(res, 400, 'itemId is required!')

        const { data, error } = await supabase
            .from('order_item')
            .update({ 'isDelete': true })
            .eq('isDelete', false)
            .eq('id', itemId)
            .select('id')

        if (error && error.message) return bad(res, 400, error.message)
        if (!data) return bad(res, 404, 'order item info unavalable!')

        return good(res, 200, undefined, 'order item deleted successfully!')
    } catch (e) {
        bad(res, 500, e.message)
    }
}