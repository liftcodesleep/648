from django.db import models
import pymysql
import random

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


def find_post_data(limit, offset, search_text, sort_col, sort_type):
    cursor, conn = get_cursor()
    sql_statement = "SELECT * FROM Posts"

    if search_text:
        if search_text[0] == '@':
            sql_statement += f""" WHERE Made_by in 
                                    (SELECT Userid FROM User
                                    WHERE UPPER(Username) LIKE '%{search_text[1:].upper()}%')
                                    """

        elif search_text[0] == '#':
            sql_statement += f""" WHERE Post_id in 
                                    (SELECT Post_id FROM Post_tags JOIN Tags
                                    on Post_tags.Tag_id = Tags.Tag_id
                                    WHERE UPPER(Name) LIKE '%{search_text[1:].upper()}%') 
                                    """
        else:
            sql_statement += f" WHERE UPPER(description) LIKE '%{search_text.upper()}%'"

    if sort_col:
        sql_statement += f" ORDER BY {sort_col} {sort_type}"

    if limit > 0 and offset > 0:
        sql_statement += f" LIMIT {limit} OFFSET {offset}"

    print(sql_statement)
    cursor.execute(sql_statement)
    data = cursor.fetchall()
    conn.close()
    return data


def create_post_in_db(username, is_reshared, description, s3_url, category):
    cursor, conn = get_cursor()
    post_id = ''

    while True:
        post_id = 'P' + str(random.randint(1, 2000))
        check_existence = f"""SELECT * FROM Posts WHERE post_id='{post_id}'"""
        cursor.execute(check_existence)
        exists = cursor.fetchall()
        if not exists:
            break

    sql_statement = f"""
                        INSERT INTO Posts
                        (Made_by, Creation_Date, No_of_likes, No_of_dislikes,
                        Points, is_reshared, post_id, no_of_views, no_of_comments,
                        image_path, description, category)
                        VALUES 
                        ('{username}', CURRENT_TIMESTAMP, 0, 0,
                        0, '{is_reshared}', '{post_id}', 0, 0,
                        '{s3_url}', '{description}', '{category}')
                    """

    cursor.execute(sql_statement)
    conn.commit()
    conn.close()
    return post_id


def add_tags_in_db(tags, post_id):
    cursor, conn = get_cursor()

    for tag in tags:
        select_statement = f"""SELECT * FROM Tags where UPPER(Name) = '{tag.upper()}'"""
        cursor.execute(select_statement)
        resp = cursor.fetchone()
        tag_id = resp[0]
        if resp and len(resp) > 0:
            pass
        else:
            tag_id = ''
            while True:
                tag_id = 'T' + str(random.randint(1, 20000))
                check_existence = f"""SELECT * FROM Tags WHERE Tag_id='{tag_id}'"""
                cursor.execute(check_existence)
                exists = cursor.fetchall()
                if not exists:
                    break

            insert_statement = f"""
                                    INSERT INTO Tags
                                    (Tag_id, Name, Description)
                                    VALUES 
                                    ('{tag_id}', '{tag}', '{tag}')
                                """
            cursor.execute(insert_statement)

        insert_post_tag_statement = f"""
                                        INSERT INTO Post_tags
                                        (Post_id, Tag_id)
                                        VALUES 
                                        ('{post_id}', '{tag_id}')
                                    """
        cursor.execute(insert_post_tag_statement)

    conn.commit()
    conn.close()
    return True
