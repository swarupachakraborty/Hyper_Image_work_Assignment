import supabase from "../../../operation/superbase"
import { emptyObject, emptyString, invalidPincode } from "../../../operation/validation"

export default async function handler(req, res) {
    switch (req.method) {
        case 'PUT':
            return await updateAddress(req, res)
        case 'DELETE':
            return await deleteAddress(req, res)
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


const updateAddress = async (req, res) => {
    try {
        const addressId = req.query.addressId || null
        const body = req.body
        const { user_id, line1, line2, city, state, country, pincode } = body
        const object = {}
        if (!emptyString(line1)) object.line1 = line1
        if (!emptyString(line2)) object.line2 = line2
        if (!emptyString(city)) object.city = city
        if (!emptyString(state)) object.state = state
        if (!emptyString(country)) object.country = country
        if (!emptyString(pincode)) {
            if (!invalidPincode(pincode)) object.pincode = pincode
            else return bad(res, 400, 'Invalid pincode!')
        }
        if (!emptyString(user_id)) {
            //db call for check if the user id isexist or not
            const userData = await supabase
                .from('user')
                .select('*')
                .eq('isDelete', false)
                .eq('id', user_id)
                if (!userData.data || userData.data.length == 0 || userData.error) return bad(res, 404, userData.error?.message || 'user id does\'t avalable!')

            object.user_id = user_id
        }
        if (emptyObject(object)) return bad(res, 400, 'please enter some key-value to update physical address data!')

        const updateTBL = await supabase
            .from('physical_address')
            .update(object)
            .eq('isDelete', false)
            .eq('id', addressId)
            .select('user_id,line1,line2,city,state,country,pincode')

        if (updateTBL.error) return bad(res, 400, updateTBL.error.message || 'physical address info unavalable')

        return good(res, 200, updateTBL.data[0], 'physical address updated successfully!')
    } catch (e) {
        console.log(e)
        bad(res, 500, e.message)
    }
}


const deleteAddress = async (req, res) => {
    try {
        const addressId = req.query.addressId || null
        if (emptyString(addressId)) return bad(res, 400, 'addressId is required!')

        const { data, error } = await supabase
            .from('physical_address')
            .update({ 'isDelete': true })
            .eq('isDelete', false)
            .eq('id', addressId)
            .select('id')

        if (error && error.message) return bad(res, 400, error.message)
        if (!data) return bad(res, 404, 'physical address info unavalable!')

        return good(res, 200, undefined, 'physical address deleted successfully!')
    } catch (e) {
        bad(res, 500, e.message)
    }
}