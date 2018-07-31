
let aws = require('aws-sdk');
let fs = require('fs');
let path = require('path');

/*
Loading AWS Credentials from Environment Variables

Set the following:
    AWS_ACCESS_KEY_ID
    AWS_SECRET_ACCESS_KEY
    AWS_SESSION_TOKEN (optional)
*/

let s3 = new AWS.S3({apiVersion: '2006-03-01'});


const configPath = "./credentials.json";
const params = {
    Bucket: 'test_bucket_073118',
    ACL: 'public-read'
};


let updateAWSConfig = (configPath) => {
    aws.config.loadFromPath(configPath);
};

let listBuckets = () => {
    s3.listBuckets(function(err,data) {
        if(err)
            console.log('Error getting S3 bucket list', err);
        else { 
            console.log('Bucket List:', data.Buckets);
        }
    })
};

let listObjects = (params) => {
    s3.listObjects(params, function(err,data) {
        if(err)
            console.log('Error get objects from S3 bucket', params.Bucket, err);
        else
            console.log('Got data from bucket:', params.Bucket, data);
    })
};

let createBucket = (params) => {
    s3.createBucket(params, function(err, data) {
        if(err)
            console.log('Error while creating the bucket', err);
        else
            console.log('s3 bucket successfully created...', data.location);
    });
};

let deleteBucket = (params) => {
    s3.deleteBucket(params, function(err, data) {
        if(err)
            console.log('Error while deleting the bucket:', err);
        else
            console.log('S3 Bucket successfully deleted...', data);
    });
};

let uploadData = (filePath, bucketName) => {
    let params = {
        Bucket: bucketName,
        Key: '',
        Body: ''
    };

    let file = filePath;
    let fileStream = fs.createReadStream(file);
    fileStream.on('error', function(err) {
        console.log('File error:', err);
    });

    params.Key = path.basename(file);
    params.Body = fileStream;

    s3.upload(params, function(err,data) {
        if(err)
            console.log('Upload error', err);
        if(data)
            console.log('Upload success', data.location);
    })
};