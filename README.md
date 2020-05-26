# interview-marmeto
# vms



# to register user
/auth/register - post

payload : 
{
	"first_name": "Jhon",
    "last_name": "doe",
    "email": "jhon@doe.com",
    "mobile_number": "7846090020",
    "password": "matter"
 }


 # login

 /auth/sign_in - post

 payload : 

 {
	"email": "jhon@doe.com",
	"password":"matter"
}



# voucher generate

/voucher/generate - post

payload : 

{"email":"jhon@doe.com","amount":5000}


# manage vouchers

/voucher/managevouchers - get

# redeem voucher

/redeem/redeemvoucher - post
payload : 
{
	"email":"jhon@doe.com",
	"voucher":"VCDZmE8Oqes27",
	"voucher_pin":"X5uMK",
	"amount":"2460"
}


# search vouchers

request query 

voucher_name
voucher_pin
email





