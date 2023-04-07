from django.db import models
import pymysql
import uuid

# Create your models here.


def get_cursor():
    conn = pymysql.connect(
        host='csc648-db-team-1.cp7px58ibcuh.us-east-1.rds.amazonaws.com',
        port=3306,
        user='adminuser',
        password='burritoman2023#',
        db='team1_database'
    )
    cursor = conn.cursor()
    return cursor, conn


def check_login_info(username, password, user_type):
    cursor, conn = get_cursor()
    sql_statement = f"""SELECT * FROM User
                        WHERE username='{username}' 
                        AND password='{password}' 
                        AND user_type='{user_type}'
                    """
    cursor.execute(sql_statement)
    data = cursor.fetchone()
    conn.close()
    return data


def insert_register(collected_data):
    print(collected_data)
    cursor, conn = get_cursor()
    sql_statement = """INSERT INTO `team1_database`.`User`
(`Name`,
`Email`,
`Userid`,
`Password`,
`DOB`,
`Date_joined`,
`Username`,
`Phone_number`,
`User_pic`,
`About`,
`User_type`)
VALUES
("{name}",
"{email}",
"{userid}",
"{password}",
"{dob}",
GET_DATE()",
"{username}",
"{phonenum}",
"{userpic}",
"{about}",
"{usertype}");""".format(**collected_data)
    print(sql_statement)
    try:
        affected_rows = cursor.execute(sql_statement)
        conn.commit()
        print("rows: " + affected_rows)
    except Exception as e:
        conn.rollback()
        print(e)
    finally:
        cursor.close()
        conn.close()
