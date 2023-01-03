const {
  smartPreCaching,
  handleTranslationRequest,
} = require("../helpers/helper");
const { langs, isSupported, getCode } = require("../helpers/languages");

exports.translate = async (req, res) => {
  let { text, source, target } = req.body;
  if (isSupported(source) && isSupported(target)) {
    source = getCode(source)
    target = getCode(target)
    const translation = await handleTranslationRequest(text, source, target);
    // Trigger smart pre-caching
    smartPreCaching(text, source, target);
    // send the repsponse
    res.send(translation);
    res.end();
  } else {
    res.status(400).send({
        message: `Sorry this version of API don't support target language ${target} and source language ${source}`
    })
  }
};
