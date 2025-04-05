WITH base AS (
    SELECT DISTINCT
        product_id
        ,option_id
        ,option_name
        ,option_value
        ,cat_id
        ,collect_id
        ,price
        ,currency
     FROM `project5-unigap.Data_model.stagingTb`
    WHERE product_id IS NOT NULL
)

SELECT * FROM base
