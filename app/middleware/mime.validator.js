const multer = require('multer')
const reqiuireMimeType = ['image/jpeg', 'image/png','image/jpg', 'application/pdf', 'video/mp4', 'video/webm']

const upload = multer({
    limits: 1024*1024*1,
    fileFilter: function(req, file, done) {
        if(reqiuireMimeType.includes(file.mimetype)){
            done(null, true)
        }else {
            done('file type is not supported', false)
        }
    }
})

module.exports = upload