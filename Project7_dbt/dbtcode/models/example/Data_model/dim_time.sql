WITH BASE AS (
    SELECT DISTINCT 
        time_stamp
        ,EXTRACT(DATE FROM time_stamp) AS date 
        ,EXTRACT(HOUR FROM time_stamp) AS hour
        ,EXTRACT(DAYOFWEEK FROM time_stamp) AS day_of_week 
    FROM `project5-unigap.Data_model.stagingTb`
)
SELECT * FROM BASE