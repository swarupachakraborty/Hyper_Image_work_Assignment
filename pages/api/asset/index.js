import supabase from "../../../operation/superbase"
import { emptyString, invalidEmail } from "../../../operation/validation"

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
        const { thumbnail_url, media_library_id } = body
        if (emptyString(thumbnail_url)) bad(res, 400, 'thumbnail_url is requires!')
        if (emptyString(media_library_id)) bad(res, 400, 'media_library_id is requires!')

        const { data, error } = await supabase
            .from('asset')
            .insert([{ thumbnail_url, media_library_id }])
            .select('id,thumbnail_url,media_library_id');

        if (error) return bad(res, 400, error.message)

        return good(res, 201, data[0], 'asset created successfully!')
    } catch (e) {
        bad(res, 500, e.message)
    }
}




const get = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('asset')
            .select('id,thumbnail_url,media_library_id')
            .eq('isDelete', false);

        if (error) return bad(res, 400, error.message)
        if (get.length == 0) return bad(res, 404, 'No asset list avalable!')

        return good(res, 201, data, 'asset list!')
    } catch (e) {
        bad(res, 500, e.message)
    }
}

