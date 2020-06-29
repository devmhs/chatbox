import getJSON from 'get-json'

export default async(req, res, next) => {
    const access_token = req.query.token
    const live_id = req.query.l
    const live_url = 'http://localhost:3333' // URL PARA O SITE LIVE CAMAROTE

    if (!access_token || !live_id) {
        return res.redirect(live_url)
    }

    try {
        await getJSON(
            live_url + '/stream/validate/user/' + live_id + '?token=' + access_token
        )
        return next()
    } catch (err) {
        return res.redirect(live_url)
    }
}