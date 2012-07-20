---
layout: post
title: Creating AWS Identity and Access Management (IAM) Signing Certificates
published: true
---

# {{ page.title }}

If you're using Amazon Web Services (AWS), you already know that it's a
good way to increase server capacity on demand. However, you may not
know that you can use AWS Identity and Access Management (IAM) to add
extra users to your AWS account. With IAM, you assign users to groups,
to which you can assign permissions such as the ability to upload to s3
or create ec2 instances.

![IAM Console](/images/2012-05-02-creating-aws-identity-and-access-management-signing-certificates/aws-iam.png)

Unfortunately, creating a signing certificate (necessary for using the
command line tols) for each user is not as easy as it should be. Unlike
the main set of account security credentials, you're forced to create
your own certificate. In the next few paragraphs, I'll tell you all you
need to know to generate these certs and associate them with your
account.

# Create an account in IAM

First, you're going to want to create an account in IAM and attach it to
a group. To get to IAM, login to your AWS console, and click the IAM tab
at the top. Next, create a group if you don't already have one.

![Make a group](/images/2012-05-02-creating-aws-identity-and-access-management-signing-certificates/make-groups.png)

Now we can make a user by first clicking the "Users" tab on the left and
then clicking the "Create New Users" button up top. Enter a username for
your user, and click "Create". In the next dialog, be sure to download
the security credentials (access key and secret key), so that you can
give them to the user.

Now click on the new user and choose "Add User to Groups" from the
"Groups" tab in the info window. Choose the group we made earlier, so
that this user has permission to do some things.

# Create public and private keys

Now we need to create a public cert to upload to aws and a private key
that will be stored on our computer. First, we'll use openssl (you'll
need to have this installed), to create the private key. Next, we'll
create a public key using this private key. Finally, we will convert our
private key to the pkcs8 format, which is what Amazon expects. I don't
know why this is necessary or what's happening, I just know that it
works. Without this change, Amazon's command line elb tools will fail.

    mkdir ~/.ec2
    cd ~/.ec2
    openssl genrsa -out pk-amazon.pem 2048

    # When you are prompted for information in this next step, just
    # leave all fields blank.
    openssl req -new -x509 -key pk-amazon.pem -out cert-amazon.pem -days 3650
    openssl pkcs8 -topk8 -in pk-amazon.pem -nocrypt > pk-temp.pem
    mv pk-temp.pem pk-amazon.pem

If you didn't properly convert your private key, then you'll see an
error like the following when you try to interact with your load
balancers.

    elb-describe-lbs:  Malformed input-The content of the file:
    /Users/trotter/.ec2/pk-amazon.pem, is not a valid private key

If you hit this error, make sure that you ran the last two lines above:

    openssl pkcs8 -topk8 -in pk-amazon.pem -nocrypt > pk-temp.pem
    mv pk-temp.pem pk-amazon.pem

# Upload certificate

Our final step is to upload our certificate to amazon. First, open the
file and copy the contents. If you're on a mac, you can do this by
running `cat cert-amazon.pem | pbcopy` from the command line. Next, go
back to your AWS console, click on your user, and choose the "Security
Credentials" tab in the info window. Click the "Manage Signing
Certificates" button, followed by "Upload Signing Certificates" in the
dialog that appears.  Now paste the certificate you copied earlier, and
click "OK". You're now ready to use your private key with amazon ec2
tools.

![Upload certificate](/images/2012-05-02-creating-aws-identity-and-access-management-signing-certificates/getting-to-upload.png)

# Testing

To test that everything works properly, set your EC2_PRIVATE_KEY and
EC2_CERT environment variables to point at your new keys.

    export EC2_PRIVATE_KEY="~/.ec2/pk-amazon.pem"
    export EC2_CERT="~/.ec2/cert-amazon.pem"

Then run `ec2-describe-instances; elb-describe-lbs`. You _should_ see a
list of your instances and loadbalancers. At the very least, you should
not see any errors.
