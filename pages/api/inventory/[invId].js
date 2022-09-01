import supabase from "../../../operation/superbase"
import { emptyNumber, emptyString } from "../../../operation/validation"

export default async function handler(req, res) {
    switch (req.method) {
        case 'PUT':
            return await updateOrder(req, res)
        case 'DELETE':
            return await deleteOrder(req, res)
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



const updateOrder = async (req, res) => {
    try {
        const invId = req.query.invId || null
        const data = req.body
        const { contract_id, name, currency, unit_amount, type, interval } = data
        const object = {}
        if (!emptyString(contract_id)) object.contract_id = contract_id
        if (!emptyString(name)) object.name = name
        if (!emptyString(currency)) object.currency = currency
        if (!emptyNumber(unit_amount)) object.unit_amount = unit_amount
        if (!emptyString(type)) object.type = type
        if (!emptyString(interval)) object.interval = interval

        const updateTBL = await supabase
            .from('inventory')
            .update(object)
            .eq('isDelete', false)
            .eq('id', invId)
            .select('id,contract_id,name,currency,unit_amount,type,interval')

        if (updateTBL.error) return bad(res, 400, updateTBL.error.message || 'inventory info unavalable')

        return good(res, 200, updateTBL.data[0], 'inventory updated successfully!')
    } catch (e) {
        console.log(e)
        bad(res, 500, e.message)
    }
}




const deleteOrder = async (req, res) => {
    try {
        const invId = req.query.invId || null
        if (emptyString(invId)) return bad(res, 400, 'inv Id is required!')

        const { data, error } = await supabase
            .from('inventory')
            .update({ 'isDelete': true })
            .eq('isDelete', false)
            .eq('id', invId)
            .select('id')

        if (error && error.message) return bad(res, 400, error.message)
        if (!data) return bad(res, 404, 'inventory info unavalable!')

        return good(res, 200, undefined, 'inventory deleted successfully!')

    } catch (e) {
        console.log(e)
        bad(res, 500, e.message)
    }
}


