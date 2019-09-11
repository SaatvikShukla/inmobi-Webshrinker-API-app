const express = require('express');
const router = express.Router();
const mongoogse = require('mongoose');

router.get('/', (req, res, next) => {
    console.log("working on get on /view")
    res.send("/Upload get ")
    // Product.find()
    //     .exec()
    //     .then(docs => {
    //         console.log(docs);
    //         res.status(200).json(docs);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.status(500).json({
    //             error: err
    //         });
    //     });
})

module.exports = router;