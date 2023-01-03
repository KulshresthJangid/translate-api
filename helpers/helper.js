//Helper functions
//Fn to store translation in the database
const storeTranslation = (text, source, target, result)=>{
    const query = `INSERT INTO translations(text, source, target, result) VALUES('${text}','${source}','${target}','${result}')`
    connection.query(query, (err, res)=>{
        if(err) throw err;
        console.log(`Succesfully stored translations in the database: Text: ${text}','${source}','${target}','${result}`)
    })
}

//fn to get cached translations from the database
const getCachedTranslation = (text, source, target)=> {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM translations WHERE text='${text}' AND source='${source}' AND target='${target}'`;
    connection.query(query, (err, res)=> {
        if(err) reject(err)
        if(res && res.length>0){
            console.log('Successfully retrived translation from the database:', res[0].result)
            resolve(res[0].result)
        } else {
            console.log("no tranlation found")
            resolve(null);
        }
    })
    })  
}

// fn to query the translation api 
const queryTranslationAPI = (text, source, target)=> {
    return new Promise((resolve, reject) =>{
        api(text, {from: source, to: target}).then(res=>{
            storeTranslation(text, source, target, res)
            console.log(`Successfully retired translation `, text, source, res)
            resolve(res)
        }).catch(err=>{
            console.error('---error while translatiing',err)
            reject(err)
        })
    })
}

//main function to handle translation requests
const handleTranslationRequest =  (text, source, target) => {
    //first check for existing translation
    return new Promise( async(resolve, reject) => {
        const cachedTranslation = await getCachedTranslation(text, source, target);
        console.log("-------------------cachedTranslation", cachedTranslation)
        if(cachedTranslation) {
            resolve(cachedTranslation) ;
        } else {
            resolve(queryTranslationAPI(text, source, target)) 
        }
    })
    
}

// smart pre-caching
const smartPreCaching = (text, source, target)=>{
    queryTranslationAPI(text, source, target)
    queryTranslationAPI(text, source, 'hindi')
    queryTranslationAPI(text, source, 'tamil')
}


module.exports = { smartPreCaching, handleTranslationRequest, queryTranslationAPI, getCachedTranslation, storeTranslation }