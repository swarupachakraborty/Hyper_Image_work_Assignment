import supabase from "../../../operation/superbase"
import { emptyObject, emptyString, invalidEmail } from "../../../operation/validation"

export default async function handler(req, res) {
    switch (req.method) {
        case 'PUT':
            return await update(req, res)
        case 'DELETE':
            return await deleteAsset(req, res)
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
        const assetId = req.query.assetId || null
        if (emptyString(assetId)) return bad(res, 400, 'assetId is required!')

        const body = req.body
        const { thumbnail_url, media_library_id } = body
        const object = {}

        if (!emptyString(thumbnail_url)) object.thumbnail_url = thumbnail_url
        if (!emptyString(media_library_id)) object.media_library_id = media_library_id

        if (emptyObject(object)) return bad(res, 400, 'please enter some key-value to update user data!')

        const updateTBL = await supabase
            .from('asset')
            .update(object)
            .eq('isDelete', false)
            .eq('id', assetId)
            .select('id,thumbnail_url,media_library_id')

        if (updateTBL.error) return bad(res, 400, updateTBL.error.message || 'asset info unavalable')

        return good(res, 200, updateTBL.data[0], 'asset updated successfully!')
    } catch (e) {
        bad(res, 500, e.message)
    }
}

const deleteAsset = async (req, res) => {
    try {
        const assetId = req.query.assetId || null
        if (emptyString(assetId)) return bad(res, 400, 'assetId is required!')

        const { data, error } = await supabase
            .from('asset')
            .update({ 'isDelete': true })
            .eq('isDelete', false)
            .eq('id', assetId)
            .select('id')

        if (error && error.message) return bad(res, 400, error.message)
        if (!data) return bad(res, 404, 'asset info unavalable!')

        return good(res, 200, undefined, 'asset deleted successfully!')
    } catch (e) {
        bad(res, 500, e.message)
    }
}