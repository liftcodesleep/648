import pymysql


# Create your models here.


def get_cursor():
    # This method creates a connection to the MySQL Database

    conn = pymysql.connect(
        host='csc648-db-team-1.cp7px58ibcuh.us-east-1.rds.amazonaws.com',
        port=3306,
        user='adminuser',
        password='burritoman2023#',
        db='team1_database'
    )
    cursor = conn.cursor()
    return cursor, conn


def insert_activity(username, text):
    # This method inserts activity into activity_log table

    cursor, conn = get_cursor()
    sql_statement = f"""INSERT INTO activity_log
                        VALUES
                        ('{username}', '{text}', CURRENT_TIMESTAMP)
                        """
    cursor.execute(sql_statement)
    conn.commit()
    conn.close()
    return True


def check_login_info(username, password, user_type):
    # This method checks if login information entered, is valid.

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
    # This method inserts details of a newly registered user

    # print(collected_data)
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
                    NOW(),
                    "{username}",
                    "{phonenum}",
                    "{userpic}",
                    "{about}",
                    "{usertype}");""".format(**collected_data)

    try:
        cursor.execute(sql_statement)
        conn.commit()
    except Exception as e:
        conn.rollback()
    finally:
        cursor.close()
        conn.close()
