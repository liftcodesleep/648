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


def find_post_data(limit, offset, search_text, sort_col, sort_type, category):
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

    if category:
        if search_text:
            sql_statement += " AND"
        else:
            sql_statement += " WHERE"
        sql_statement += f" Upper(category) LIKE '{category.upper()}'"

    if sort_col:
        sql_statement += f" ORDER BY {sort_col} {sort_type}"

    if limit > 0 and offset > 0:
        sql_statement += f" LIMIT {limit} OFFSET {offset}"

    print(sql_statement)
    cursor.execute(sql_statement)
    data = cursor.fetchall()
    conn.close()
    return data


def find_user_post_data(limit, offset, search_text, sort_col, sort_type, username):
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

    if username:
        if search_text:
            sql_statement += " AND"
        else:
            sql_statement += " WHERE"
        sql_statement += f" Upper(Made_by) LIKE '{username.upper()}'"

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


def find_post_details(postid):
    cursor, conn = get_cursor()
    sql_statement = f"SELECT * FROM Posts WHERE post_id='{postid}'"
    print(sql_statement)
    cursor.execute(sql_statement)
    data = cursor.fetchone()
    conn.close()
    return data


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


def like_dislike_post_db(postid, liked):
    try:
        cursor, conn = get_cursor()
        to_update_col = "No_of_likes" if liked else "No_of_dislikes"

        sql_statement = f"""
                            UPDATE Posts
                            SET
                            {to_update_col} = {to_update_col} + 1
                            WHERE
                            post_id='{postid}'    
                        """
        print(sql_statement)
        cursor.execute(sql_statement)

        sql_statement = f"""SELECT No_of_likes, No_of_dislikes FROM Posts WHERE post_id='{postid}'"""
        cursor.execute(sql_statement)
        data = cursor.fetchone()

        conn.commit()
        conn.close()
        return True, data
    except:
        raise Exception("Something went wrong with db operation")


def add_comment_to_db(postid, comment, username):
    cursor, conn = get_cursor()
    sql_statement = f"""
                        INSERT INTO comments 
                        (`post_id`,
                        `comment_made_by`, `comment_datetime`,
                        `comment_desc`, `comment_likes`)
                        VALUES
                        ('{postid}', '{username}', CURRENT_TIMESTAMP,
                        '{comment}', 0)
                    """
    print(sql_statement)
    cursor.execute(sql_statement)

    sql_statement = f"""
                        UPDATE Posts
                        SET
                        no_of_comments = no_of_comments + 1
                        WHERE
                        post_id='{postid}'
                    """
    cursor.execute(sql_statement)

    no_of_comments, comments = fetch_comments(postid)

    conn.commit()
    conn.close()
    return True, no_of_comments, comments


def fetch_comments(postid):
    cursor, conn = get_cursor()

    sql_statement = f"""SELECT no_of_comments FROM Posts WHERE post_id='{postid}'"""
    cursor.execute(sql_statement)
    no_of_comments = cursor.fetchone()[0]

    sql_statement = f"""
                        SELECT comment_id, comment_made_by,
                        comment_datetime, comment_desc, comment_likes
                        FROM comments
                        WHERE post_id='{postid}'
                    """
    cursor.execute(sql_statement)
    comments = cursor.fetchall()

    conn.commit()
    conn.close()
    return no_of_comments, comments


def delete_comment_from_db(postid, commentid, username):
    cursor, conn = get_cursor()

    sql_statement = f"""SELECT COUNT(*) FROM Posts WHERE post_id='{postid}' and Made_by='{username}'"""
    cursor.execute(sql_statement)
    can_be_deleted = cursor.fetchone()[0]

    if can_be_deleted == 1:
        sql_statement = f"""
                                    DELETE FROM comments
                                    WHERE comment_id='{commentid}' and post_id='{postid}'
                                """
        cursor.execute(sql_statement)

        sql_statement = f"""
                            UPDATE Posts
                            SET
                            no_of_comments = no_of_comments - 1
                            WHERE
                            post_id='{postid}'
                        """
        cursor.execute(sql_statement)

    else:
        return False

    cursor.execute(sql_statement)

    conn.commit()
    conn.close()
    return True