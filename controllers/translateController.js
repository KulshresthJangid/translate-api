const { smartPreCaching, handleTranslationRequest } = require('../helpers/helper')

exports.translate = async (req, res) => {
    const { text, source, target } = req.body;

    const translation = await handleTranslationRequest(text, source, target);
    // Trigger smart pre-caching
    smartPreCaching(text, source, target);
    // send the repsponse
    res.send(translation);
    res.end();
}