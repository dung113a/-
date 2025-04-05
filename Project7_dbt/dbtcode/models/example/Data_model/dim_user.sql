WITH BASE AS (
    SELECT DISTINCT 
         user_id_db 
         ,device_id
         ,email_address 
         ,user_agent
         ,resolution 
    FROM `project5-unigap.Data_model.stagingTb`
    WHERE user_id_db IS  NOT NULL 
)
SELECT * FROM BASE