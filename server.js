const { query } = require("express")
const express = require("express")
const db = require('mysql')
const app = express()

const connection = db.createConnection({
    host: "localhost",
    user: "kuldev",
    password: "kuldev",
    database: "translation_cache"
})

const api = require('translate-google')

app.use(express.json())

api('我说中文', {to: 'en'}).then(res => {
    console.log(res)
}).catch(err => {
    console.error(err)
})

connection.connect(function(err) {
    if(err) throw err;
    console.log("Connected!")
})

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

app.get('/translate',async (req, res) => {
    const { text, source, target } = req.body
    console.log("-------------------",req.body)

    const translation = await handleTranslationRequest(text, source, target)
    // Trigger smart pre-caching
    smartPreCaching(text, source, target);
    console.log("-------------------translation",translation)
    // send the repsponse
    res.send(translation)
    res.end()
})


app.listen(3000, () => {
    console.log(`Server is up and running`)
})  