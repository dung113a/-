WITH BASE AS (
    SELECT 
        user_id_db
        ,product_id
        ,option_id
        ,order_id
        ,time_stamp as chechout_time 
        ,price 
        ,currency 
        ,is_paypal 
    FROM `project5-unigap.Data_model.stagingTb`
    WHERE collection = 'checkout_success'

)

SELECT * FROM BASE