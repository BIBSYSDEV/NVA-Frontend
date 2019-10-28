# /bin/bash
# input:
# Input parameters to cloudformation is stored in cloudformation_parameters.json

# create deploy bucket
aws s3 mb s3://frontend-deploy

# copy template files to deploy bucket
aws s3 cp pipeline_template.yml s3://frontend-deploy/frontend_parent_template.yml
aws s3 cp pipeline_template.yml s3://frontend-deploy/pipeline_template.yml
aws s3 cp cloudfront_template.yml s3://frontend-deploy/cloudfront_template.yml

# create cloudformation stack
aws cloudformation create-stack --stack-name frontend-test-script-stack --template-url https://frontend-deploy.s3-eu-west-1.amazonaws.com/frontend_parent_template.yml --parameters file://cloudformation_parameters.json

# cleanup
aws s3 rm s3://frontend-deploy --recursive
aws s3 rb s3://frontend-deploy
