// Multer is a file-handling middleware which gives Express finle handling properties
// Storing uploaded files in our local machine's disk storage for now. Similar protocol will be used to upload to a third party servide such as AWS S3 Buckets

import multer from 'multer'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images') // null - error handling parameter (multer automatically handles errors - hence, null)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix); // adding uniqueSuffix to user given filename to ensure two users don't upload the same file names in our database
  }
})

export const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1 * 1000 * 1000 // fileSize is in bytes - Hence, max limit is 1MB in this case
    } 
})