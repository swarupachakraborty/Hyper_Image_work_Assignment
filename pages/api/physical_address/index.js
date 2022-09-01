import supabase from "../../../operation/superbase"
import { emptyString, invalidEmail, invalidPincode } from "../../../operation/validation"

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
        const body = req.body
        const { user_id, line1, line2, city, state, country, pincode } = body
        if (emptyString(user_id)) bad(res, 400, 'user_id is requires!')
        if (emptyString(line1)) bad(res, 400, 'line1 is requires!')
        if (emptyString(city)) bad(res, 400, 'city address is requires!')
        if (emptyString(state)) bad(res, 400, 'state is requires!')
        if (emptyString(country)) bad(res, 400, 'country is requires!')
        if (emptyString(pincode)) bad(res, 400, 'pincode is requires!')
        if (invalidPincode(pincode)) bad(res, 400, 'invalid pincode!')

        //db call for check if the user id isexist or not
        const userData = await supabase
            .from('user')
            .select('*')
            .eq('isDelete', false)
            .eq('id', user_id)
        if (!userData.data || userData.data.length == 0 || userData.error) return bad(res, 404, userData.error?.message || 'user id does\'t avalable!')

        const createData = await supabase
            .from('physical_address')
            .insert([{ user_id, line1, line2, city, state, country, pincode }]);

        if (createData.error) return bad(res, 400, error.message)

        return good(res, 201, createData.data[0], 'physical address created successfully!')
    } catch (e) {
        console.log(e)
        bad(res, 500, e.message)
    }
}




const get = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('physical_address')
            .select('user_id,line1,line2,city,state,country,pincode')
            .eq('isDelete', false);

        if (error) return bad(res, 400, error.message)
        if (get.length == 0) return bad(res, 404, 'No user list avalable!')

        return good(res, 200, data, 'user list!')
    } catch (e) {
        bad(res, 500, e.message)
    }
}