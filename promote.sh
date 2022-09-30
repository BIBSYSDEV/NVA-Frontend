export VERSION = date +%Y%m%d
aws s3 cp $S3_BUCKET/builds/latest $S3_BUCKET/builds/$VERSION