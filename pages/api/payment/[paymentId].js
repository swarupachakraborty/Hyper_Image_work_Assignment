import supabase from "../../../operation/superbase"
import { emptyObject, emptyString, invalidEmail } from "../../../operation/validation"

export default async function handler(req, res) {
    switch (req.method) {
        case 'PUT':
            return await update(req, res)
        case 'DELETE':
            return await deletePayment(req, res)
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
        const paymentId = req.query.paymentId || null
        if (emptyString(paymentId)) return bad(res, 400, 'paymentId is required!')

        const body = req.body
        const { amount, source, source_reference_id, order_id, currency } = body
        const object = {}

        if (!emptyString(amount)) object.amount = amount
        if (!emptyString(source)) object.source = source
        if (!emptyString(source_reference_id)) object.source_reference_id = source_reference_id
        if (!emptyString(order_id)) {
            //db call for check if the order id isexist or not
            const userData = await supabase
                .from('order')
                .select('*')
                .eq('isDelete', false)
            if (!userData.data || userData.data.length == 0 || userData.error) return bad(res, 404, userData.error?.message || 'order id does\'t avalable!')

            object.order_id = order_id
        }
        if (!emptyString(currency)) object.currency = currency


        if (emptyObject(object)) return bad(res, 400, 'please enter some key-value to update user data!')

        const updateTBL = await supabase
            .from('payment')
            .update(object)
            .eq('isDelete', false)
            .eq('id', paymentId)
            .select('id,amount,source,source_reference_id,order_id,currency')

        if (updateTBL.error) return bad(res, 400, updateTBL.error.message || 'payment info unavalable')

        return good(res, 200, updateTBL.data[0], 'payment updated successfully!')
    } catch (e) {
        bad(res, 500, e.message)
    }
}

const deletePayment = async (req, res) => {
    try {
        const paymentId = req.query.paymentId || null
        if (emptyString(paymentId)) return bad(res, 400, 'paymentId is required!')

        const { data, error } = await supabase
            .from('payment')
            .update({ 'isDelete': true })
            .eq('isDelete', false)
            .eq('id', paymentId)
            .select('id')

        if (error && error.message) return bad(res, 400, error.message)
        if (!data) return bad(res, 404, 'Payment info unavalable!')

        return good(res, 200, undefined, 'Payment deleted successfully!')
    } catch (e) {
        bad(res, 500, e.message)
    }
}