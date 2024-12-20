ALTER TABLE User_Information
ADD Uavatar VARCHAR(255),
    RegisterDate DATETIME NOT NULL DEFAULT GETDATE();


    UPDATE User_Information
SET Uavatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXzxvld92GmNc_C-jxe1zC-jJd_EpNWZj4Ww&s'
WHERE Uacc = '000';

UPDATE User_Information
SET Uavatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpF_QB297Z-n5cyDgf1jkJOYBR3DYxY1OtPg&s'
WHERE Uacc = '111';

UPDATE User_Information
SET Uavatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGg7EJlJgT04LtZYl6BCefIUOeQSX6waPQmA&s'
WHERE Uacc = '123';

UPDATE User_Information
SET Uavatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLv1kxrmjWPqw_zzPPnxudN6pPrtpteYiwLw&s'
WHERE Uacc = '456';



SELECT Una, Uacc, Upwd, Uemail, Star, Uavatar, RegisterDate
From User_Information


SELECT Una, Uacc, Upwd, Uemail, Star, Uavatar, RegisterDate
FROM User_Information
WHERE 111 = @Uacc;


SELECT Una, Uacc, Upwd, Uemail, Star, Uavatar, RegisterDate 
FROM User_Information 
WHERE Uacc = '111';

SELECT Una, Uacc, Upwd, Uemail, Star, Uavatar, RegisterDate 
FROM User_Information 
WHERE Uacc LIKE @Uacc;
